import fetch, { Response } from 'node-fetch';
import ProgressBar from 'progress';
import fs from 'fs';
import yargs from 'yargs';
import config from '../config';

async function run() {
  const argv = await yargs
    .usage(
      'Usage: $0 --out=[output file, default: ./data/products/products.csv.gz ]'
    )
    .options({
      out: { type: 'string', default: './data/products/products.csv.gz' },
    }).argv;

  let latestResp: Response;

  if (!config.infracostAPIKey) {
    config.logger.error('Please set INFRACOST_API_KEY.');
    config.logger.error(
      'A new key can be obtained by installing the infracost CLI and running "infracost auth login".  The key is usually saved in ~/.config/infracost/credentials.yml'
    );
    process.exit(1);
  }

  try {
    latestResp = await fetch(
      `${config.infracostPricingApiEndpoint}/data-download/latest`,
      {
        headers: {
          'X-Api-Key': config.infracostAPIKey || '',
          'X-Cloud-Pricing-Api-Version': process.env.npm_package_version || '',
        },
      }
    );
    if (!latestResp.ok) {
      const body = latestResp.body.read().toString();

      config.logger.error(
        `There was an error downloading data: HTTP ${latestResp.status}: ${body}`
      );

      try {
        const errorData = (await JSON.parse(body)) as { error: string };
        if (
          latestResp.status === 403 &&
          errorData.error === 'Invalid API key'
        ) {
          config.logger.error(
            'You do not have permission to download data. Please set a valid INFRACOST_API_KEY.'
          );
          config.logger.error(
            'A new key can be obtained by installing the infracost CLI and running "infracost auth login".  The key is usually saved in ~/.config/infracost/credentials.yml'
          );
        }
      } catch (e) {
        // eslint-disable no-empty
        // We don't care if the body is not valid JSON since we log it above anyway
      }

      process.exit(1);
    }
  } catch (e) {
    config.logger.error(`There was an error downloading data: ${e}`);
    process.exit(1);
  }

  const { downloadUrl } = (await latestResp.json()) as { downloadUrl: string };
  config.logger.debug(`Downloading dump from ${downloadUrl}`);

  const writer = fs.createWriteStream(argv.out);

  await new Promise((resolve, reject) => {
    fetch(downloadUrl, {
      method: 'get',
    }).then((resp) => {
      const progressBar = new ProgressBar(
        `-> downloading ${argv.out} [:bar] :percent (:etas remaining)`,
        {
          width: 40,
          complete: '=',
          incomplete: ' ',
          renderThrottle: 500,
          total: parseInt(resp.headers.get('content-length') || '0', 10),
        }
      );

      resp.body.on('data', (chunk: { length: number }) =>
        progressBar.tick(chunk.length)
      );

      resp.body.pipe(writer);

      let error: Error | null = null;
      writer.on('error', (err) => {
        error = err;
        writer.close();
        reject(err);
      });

      writer.on('close', () => {
        if (!error) {
          resolve(true);
        }
      });
    });
  });
}

config.logger.info('Starting: downloading DB data');
run()
  .then(() => {
    config.logger.info('Completed: downloading DB data');
    process.exit(0);
  })
  .catch((err) => {
    config.logger.error(err);
    process.exit(1);
  });
