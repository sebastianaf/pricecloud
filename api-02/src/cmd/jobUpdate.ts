import { execSync } from 'child_process';
import glob from 'glob';
import config from '../config';
import { fetchLastSuccessfullyUpdatedAt } from '../stats/stats';

async function run(): Promise<void> {
  // Check if ./data/products exists and has files
  const dumpFiles = glob.sync(`./data/products/*.csv.gz`);
  const dumpFileExists = dumpFiles.length !== 0;

  // Check if the last update was less than 24 hours ago
  const lastUpdatedAt = await fetchLastSuccessfullyUpdatedAt();
  const upToDate =
    lastUpdatedAt && lastUpdatedAt.getTime() > Date.now() - 24 * 60 * 60 * 1000;

  if (dumpFileExists && lastUpdatedAt && upToDate) {
    config.logger.info(
      `Skipping update as the pricing database was already updated in the last 24 hours (${lastUpdatedAt.toISOString()}).`
    );
    process.exit(0);
  }

  const isTypeScript = __filename.endsWith('ts');

  // Run the data download
  execSync(`npm run data:download${isTypeScript ? ':dev' : ''}`, {
    stdio: 'inherit',
  });

  // Run the data load
  execSync(`npm run data:load${isTypeScript ? ':dev' : ''}`, {
    stdio: 'inherit',
  });
}

config.logger.info('Starting: updating the DB');
run()
  .then(() => {
    config.logger.info('Completed: updating the DB');
    process.exit(0);
  })
  .catch((err) => {
    config.logger.error(err);
    process.exit(1);
  });
