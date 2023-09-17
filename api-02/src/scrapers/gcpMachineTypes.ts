import { compute_v1, google } from 'googleapis';
import { Decimal } from 'decimal.js';
import _ from 'lodash';
import config from '../config';
import { Price, Product } from '../db/types';
import { generatePriceHash, generateProductHash } from '../db/helpers';
import { upsertProducts } from '../db/upsert';
import { findProducts } from '../db/query';

// TODO: refactor to use compute.machineTypes.list()
const machineTypeDescriptionLookups: {
  [key: string]: { [key: string]: string };
} = {
  a2: {
    cpu: 'A2 Instance Core',
    memory: 'A2 Instance Ram',
  },
  c2: {
    cpu: 'Compute optimized Core',
    memory: 'Compute optimized Ram',
  },
  c2d: {
    cpu: 'C2D AMD Instance Core',
    memory: 'C2D AMD Instance Ram',
  },
  c3: {
    cpu: 'Compute optimized Core',
    memory: 'Compute optimized Ram',
  },
  e2: {
    cpu: 'E2 Instance Core',
    memory: 'E2 Instance Ram',
  },
  f1: {
    total: 'Micro Instance with burstable CPU',
  },
  g1: {
    total: 'Small Instance with 1 VCPU',
  },
  // G2 is not available in all regions
  g2: {
    cpu: 'G2 Instance Core',
    memory: 'G2 Instance Ram',
  },
  m1: {
    cpu: 'Memory-optimized Instance Core',
    // Some regions have "Preemptible Memory-optimized Instance Ram"
    // some have "Preemptible Memory-optimized Ram"
    memory: 'Memory-optimized (Instance )?Ram',
  },
  m2: {
    cpu: 'Memory-optimized Instance Core',
    memory: 'Memory-optimized (Instance )?Ram',
  },
  m3: {
    cpu: 'Memory-optimized Instance Core',
    memory: 'Memory-optimized (Instance )?Ram',
  },
  n1: {
    cpu: 'N1 Predefined Instance Core',
    memory: 'N1 Predefined Instance Ram',
  },
  n2: {
    cpu: 'N2 Instance Core',
    memory: 'N2 Instance Ram',
  },
  n2d: {
    cpu: 'N2D AMD Instance Core',
    memory: 'N2D AMD Instance Ram',
  },
  // T2A is not available in all regions
  t2a: {
    cpu: 'T2A Arm Instance Core',
    memory: 'T2A Arm Instance Ram',
  },
  t2d: {
    cpu: 'T2D AMD Instance Core',
    memory: 'T2D AMD Instance Ram',
  },
};

const machineTypeOverrides: {
  [key: string]: { cpu?: number; memory?: number };
} = {
  'e2-micro': { cpu: 0.25 },
  'e2-small': { cpu: 0.5 },
  'e2-medium': { cpu: 1 },
};

async function scrape(): Promise<void> {
  const auth = new google.auth.GoogleAuth({
    keyFile: config.gcpKeyFile,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const compute = google.compute({
    version: 'v1',
    auth,
  });

  const regionResp = await compute.regions.list({
    project: config.gcpProject,
  });

  const zoneResp = await compute.zones.list({
    project: config.gcpProject,
  });
  const zones = (zoneResp.data.items || []).map((i) => i.name || '');

  const products: Product[] = [];

  for (const region of regionResp.data.items || []) {
    const regionName = region.name || '';
    const regionZones = zones.filter((z) => z.startsWith(regionName));

    const machineTypeMap: { [key: string]: compute_v1.Schema$MachineType } = {};

    for (const zone of regionZones) {
      const machineTypeResp = await compute.machineTypes.list({
        project: config.gcpProject,
        zone,
      });

      for (const machineType of machineTypeResp.data.items || []) {
        if (machineType.name) {
          machineTypeMap[machineType.name] ||= machineType;
        }
      }
    }

    for (const [name, machineType] of Object.entries(machineTypeMap)) {
      config.logger.info(`Adding machine type ${name} for ${regionName}`);

      const product: Product = {
        productHash: '',
        sku: `generated-${name}`,
        vendorName: 'gcp',
        region: regionName,
        service: 'Compute Engine',
        productFamily: 'Compute Instance',
        attributes: {
          machineType: name,
        },
        prices: [],
      };

      product.productHash = generateProductHash(product);

      const onDemandPrice = await createPrice(
        product,
        machineType,
        'on_demand'
      );
      if (onDemandPrice) {
        product.prices.push(onDemandPrice);
      }

      const preemptiblePrice = await createPrice(
        product,
        machineType,
        'preemptible'
      );
      if (preemptiblePrice) {
        product.prices.push(preemptiblePrice);
      }

      products.push(product);
    }
  }

  await upsertProducts(products);
}

async function createPrice(
  product: Product,
  machineType: compute_v1.Schema$MachineType,
  purchaseOption: string
): Promise<Price | null> {
  const machineTypeName = machineType.name || '';
  const prefix = machineTypeName.split('-')[0];

  let result: { amount: Decimal; effectiveDateStart: string } | null = null;

  if (!machineTypeDescriptionLookups[prefix]) {
    config.logger.warn(
      `Could not find description lookup for machine type ${machineTypeName}`
    );
    return null;
  }

  if (machineTypeDescriptionLookups[prefix].total) {
    result = await calculateAmountFromTotal(
      product,
      machineType,
      purchaseOption
    );
  } else {
    result = await calculateAmountFromCpuAndMem(
      product,
      machineType,
      purchaseOption
    );
  }
  if (!result) {
    return null;
  }
  const { amount, effectiveDateStart } = result;

  const price = {
    priceHash: '',
    purchaseOption,
    unit: 'Hours',
    USD: amount.toString(),
    effectiveDateStart: effectiveDateStart.toString(),
  };
  price.priceHash = generatePriceHash(product, price);
  return price;
}

async function calculateAmountFromTotal(
  product: Product,
  machineType: compute_v1.Schema$MachineType,
  purchaseOption: string
): Promise<{ amount: Decimal; effectiveDateStart: string } | null> {
  const machineTypeName = machineType.name || '';
  const prefix = machineTypeName.split('-')[0];

  const desc = machineTypeDescriptionLookups[prefix].total;

  let descRegex = new RegExp(`^${desc}`);
  if (purchaseOption === 'preemptible') {
    descRegex = new RegExp(`^Spot Preemptible ${desc}`);
  }

  const matchedProduct = await findComputeProducts(product.region, descRegex);

  if (!matchedProduct) {
    config.logger.warn(
      `Could not find product for machine type ${machineTypeName} and purchase option ${purchaseOption}`
    );
    return null;
  }

  const matchedPrice =
    matchedProduct.prices.find((p) => p.endUsageAmount == null) ||
    matchedProduct.prices[0];
  const amount = new Decimal(matchedPrice.USD || 0);
  const effectiveDateStart =
    matchedPrice.effectiveDateStart || new Date().toString();

  return { amount, effectiveDateStart };
}

async function calculateAmountFromCpuAndMem(
  product: Product,
  machineType: compute_v1.Schema$MachineType,
  purchaseOption: string
): Promise<{ amount: Decimal; effectiveDateStart: string } | null> {
  const machineTypeName = machineType.name || '';
  const prefix = machineTypeName.split('-')[0];

  const cpuDesc = machineTypeDescriptionLookups[prefix].cpu;
  const memDesc = machineTypeDescriptionLookups[prefix].memory;

  let cpuDescRegex = new RegExp(`^${cpuDesc}`);
  let memDescRegex = new RegExp(`^${memDesc}`);
  if (purchaseOption === 'preemptible') {
    cpuDescRegex = new RegExp(`^Spot Preemptible ${cpuDesc}`);
    memDescRegex = new RegExp(`^Spot Preemptible ${memDesc}`);
  }

  const cpuProduct = await findComputeProducts(product.region, cpuDescRegex);
  const memProduct = await findComputeProducts(product.region, memDescRegex);

  if (!cpuProduct) {
    config.logger.warn(
      `Could not find CPU product for machine type ${machineTypeName} and purchase option ${purchaseOption}`
    );
    return null;
  }
  if (!memProduct) {
    config.logger.warn(
      `Could not find memory product for machine type ${machineTypeName} and purchase option ${purchaseOption}`
    );
    return null;
  }

  const overrides = machineTypeOverrides[machineTypeName];
  let cpu = new Decimal(machineType.guestCpus || 0);
  let mem = new Decimal(machineType.memoryMb || 0)
    .div(new Decimal(1024))
    .toDP(2);
  if (overrides?.cpu) {
    cpu = new Decimal(overrides.cpu);
  }
  if (overrides?.memory) {
    mem = new Decimal(overrides.memory);
  }

  const cpuPrice =
    cpuProduct.prices.find((p) => p.endUsageAmount == null) ||
    cpuProduct.prices[0];
  const memPrice =
    memProduct.prices.find((p) => p.endUsageAmount == null) ||
    memProduct.prices[0];

  const amount = cpu
    .mul(new Decimal(cpuPrice.USD || 0))
    .add(mem.mul(new Decimal(memPrice.USD || 0)));

  const cpuEffectiveDateStart = cpuPrice.effectiveDateStart;
  const memEffectiveDateStart = memPrice.effectiveDateStart;
  const effectiveDateStart =
    _.min([cpuEffectiveDateStart, memEffectiveDateStart]) ||
    new Date().toString();

  return { amount, effectiveDateStart };
}

async function findComputeProducts(
  region: string | null,
  description: RegExp
): Promise<Product | null> {
  const products = await findProducts(
    {
      vendorName: 'gcp',
      service: 'Compute Engine',
      productFamily: 'Compute',
      region: region || '',
    },
    [
      // eslint-disable-next-line camelcase
      { key: 'description', value_regex: `/${description.source}/` },
    ],
    1
  );

  return products.length > 0 ? products[0] : null;
}

export default {
  scrape,
};
