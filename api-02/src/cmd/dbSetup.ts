import { PoolClient } from 'pg';
import config from '../config';
import {
  createInstallsTable,
  createProductsTable,
  createProductsTableIndex,
  createStatsTable,
} from '../db/setup';

const attempts = 10;
const backOffSecs = 10;

async function run(): Promise<void> {
  const pool = await config.pg();

  let client: PoolClient | null = null;

  for (let i = 0; i < attempts; i++) {
    try {
      client = await pool.connect();
      break;
    } catch (e) {
      config.logger.error(
        `Waiting for PostgreSQL to become available: ${e.message}`
      );
      await new Promise((resolve) => {
        setTimeout(resolve, backOffSecs * 1000);
      });
    }
  }

  if (client === null) {
    throw new Error('Failed to connect to PostgreSQL');
  }

  try {
    await client.query('BEGIN');
    await createProductsTable(client, config.productTableName, true);
    await createProductsTableIndex(client, config.productTableName, true);
    await createStatsTable(client, config.statsTableName, true);
    await createInstallsTable(client, config.installsTableName, true);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

config.logger.info('Starting: DB setup');
run()
  .then(() => {
    config.logger.info('Completed: DB setup');
    process.exit(0);
  })
  .catch((err) => {
    config.logger.error(err);
    process.exit(1);
  });
