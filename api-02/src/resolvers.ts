import { IResolvers } from '@graphql-tools/utils';
import mingo from 'mingo';
import { GraphQLError } from 'graphql';
import _ from 'lodash';
import { Price, Product } from './db/types';
import currency, { CURRENCY_CODES } from './utils/currency';
import { findProducts } from './db/query';
import { ApplicationOptions } from './app';

const productLimit = 1000;

type MongoDbFilter = { [attr: string]: { [op: string]: string | RegExp } };

type Filter = { [key: string]: string };

type AttributeFilter = {
  key: string;
  value?: string;
  // eslint-disable-next-line camelcase
  value_regex?: string;
};

interface ProductsArgs {
  filter: Filter & {
    attributeFilters: AttributeFilter[];
  };
}

interface PricesArgs {
  filter: Filter;
}

type TransformedProductAttribute = {
  key: string;
  value: string;
};

function strToRegex(str: string): RegExp {
  const pattern = (str.match(/\/(.+)\/.*/) || [''])[1];
  const options = (str.match(/\/.+\/(.*)/) || [undefined])[1];
  return new RegExp(pattern, options);
}

const getResolvers = <TContext>(
  ops: ApplicationOptions<TContext>
): IResolvers => ({
  Query: {
    products: async (
      _parent: unknown,
      args: ProductsArgs,
      context: TContext
    ): Promise<Product[]> => {
      const { attributeFilters, ...otherFilters } = args.filter;

      // When querying AmazonEC2, require specific filters that will use the db indexes efficiently.
      if (otherFilters.service === "AmazonEC2") {
        if (!otherFilters.region || !otherFilters.productFamily) {
          throw new GraphQLError('"region" and "productFamily" filters are required when "service"="AmazonEC2"', {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          });
        }

        if (otherFilters.productFamily.startsWith("Compute Instance") &&
            !_.some(attributeFilters, f => f.key === 'instanceType') )
        {
          throw new GraphQLError('"instanceType" attribute filter is required when "service"="AmazonEC2" and "productFamily"="Compute Instance*"', {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          });
        }
      }

      const products = await findProducts(
        otherFilters,
        attributeFilters,
        productLimit
      );
      if (ops.convertProducts) {
        return ops.convertProducts(context, products);
      }

      return products;
    },
  },
  Product: {
    attributes: async (
      product: Product
    ): Promise<TransformedProductAttribute[]> =>
      Object.entries(product.attributes).map((a) => ({
        key: a[0],
        value: a[1],
      })),
    prices: async (product: Product, args: PricesArgs): Promise<Price[]> => {
      let prices = mingo
        .find(product.prices, transformFilter(args.filter))
        .all() as Price[];
      prices = mergeCny(product, prices);

      await convertCurrencies(prices);

      return prices;
    },
  },
  Price:
    // For every alternate currency, add a resolver that converts from USD.
    Object.fromEntries(
      CURRENCY_CODES.map((code) => [
        code,
        async (price: Price): Promise<number> =>
          currency.convert('USD', code, Number(price.USD)),
      ])
    ),
});

function transformFilter(filter: Filter): MongoDbFilter {
  const transformed: MongoDbFilter = {};
  if (!filter) {
    return transformed;
  }
  Object.entries(filter).forEach((filterItem) => {
    const keyPart = filterItem[0];
    let value: any = filterItem[1]; // eslint-disable-line @typescript-eslint/no-explicit-any
    let op = '$eq';

    const [key, opPart] = keyPart.split('_');
    if (opPart === 'regex') {
      op = '$regex';
      value = strToRegex(value);
    } else if (value === '') {
      op = '$in';
      value = ['', null];
    }

    transformed[key] = {};
    transformed[key][op] = value;
  });
  return transformed;
}

// The AWS & AWS China prices come from separate pricing APIS.  For region-less services, the products
// overlap and the price hashes can collide.  Ideally the scraper would detect this and merge them into
// a single price with the USD & CNY prices, but for now we merge them as needed on the fly here.
function mergeCny(product: Product, prices: Price[]): Price[] {
  if (product.vendorName !== 'aws' || product.region !== null) {
    return prices;
  }

  // split out the CNY specific prices
  const [cnyPrices, otherPrices] = _.partition(prices, (p) =>
    p.priceHash.endsWith('-cny')
  );

  const groupedCny = _.groupBy(
    cnyPrices,
    (p) => `${p.priceHash}-${p.startUsageAmount}-${p.endUsageAmount}`
  );

  for (const price of otherPrices) {
    const cnyKey = `${price.priceHash}-cny-${price.startUsageAmount}-${price.endUsageAmount}`;
    const grouped = groupedCny[cnyKey];
    if (
      grouped?.length === 1 &&
      grouped[0].USD == null &&
      grouped[0].CNY != null
    ) {
      // there is one matching CNY price, merge the CNY price into this one.
      price.CNY = grouped[0].CNY;
      delete groupedCny[cnyKey];
    }
  }

  for (const grouped of Object.values(groupedCny)) {
    for (const remainingPrice of grouped) {
      otherPrices.push(remainingPrice);
    }
  }

  return otherPrices;
}

async function convertCurrencies(prices: Price[]) {
  for (const price of prices) {
    // use == instead of === so we're checking for null || undefined.
    if (price.USD == null && price.CNY != null) {
      const usd = await currency.convert('CNY', 'USD', Number(price.CNY));
      price.USD = usd.toString();
    }
  }
}

export default getResolvers;
