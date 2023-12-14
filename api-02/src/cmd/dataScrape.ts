import yargs from 'yargs';
import config from '../config';
import awsBulk from '../scrapers/awsBulk';
import awsSpot from '../scrapers/awsSpot';
import azureRetail from '../scrapers/azureRetail';
import gcpCatalog from '../scrapers/gcpCatalog';
import gcpMachineTypes from '../scrapers/gcpMachineTypes';
import { setPriceUpdateFailed, setPriceUpdateSuccessful } from '../stats/stats';
import { SocketEvent } from '../socket/event';
import { Socket } from 'socket.io';

interface ScraperConfig {
  vendor: string;
  source: string;
  scraperFunc: () => void;
}

const Scrapers = {
  aws: {
    bulk: awsBulk.scrape,
    spot: awsSpot.scrape,
  },
  azure: {
    retail: azureRetail.scrape,
  },
  gcp: {
    catalog: gcpCatalog.scrape,
    machineTypes: gcpMachineTypes.scrape,
  },
};

export async function run(socket: Socket, event: SocketEvent): Promise<void> {
  config.logAndEmit(
    socket,
    event,
    'Iniciando: scraping de precios desde CCSPs'
  );
  const argv = await yargs
    .usage(
      'Usage: $0 --only=[aws:bulk,aws:spot,azure:retail,gcp:catalog,gcp:machineTypes]'
    )
    .options({
      only: { type: 'string' },
    }).argv;

  const scraperConfigs: ScraperConfig[] = [];

  Object.entries(Scrapers).forEach((scraperEntry) => {
    const [vendor, vendorScrapers] = scraperEntry;
    Object.entries(vendorScrapers).forEach((vendorScraperEntry) => {
      const [source, scraperFunc] = vendorScraperEntry;

      if (
        !argv.only ||
        (argv.only && argv.only.split(',').includes(`${vendor}:${source}`))
      ) {
        scraperConfigs.push({
          vendor,
          source,
          scraperFunc,
        });
      }
    });
  });

  let success = true;

  for (const scraperConfig of scraperConfigs) {
    config.logAndEmit(
      socket,
      event,
      `Ejecutando actualizacion de funcion para ${scraperConfig.vendor}:${scraperConfig.source}`
    );
    try {
      await scraperConfig.scraperFunc();
    } catch (err) {
      config.logAndEmit(socket, event, (err as Error).message.toString());
      success = false;
    }
  }

  if (success) {
    await setPriceUpdateSuccessful();
  } else {
    await setPriceUpdateFailed();
  }
  config.logAndEmit(
    socket,
    event,
    'Completado: scraping de precios desde CCSPs'
  );
}
