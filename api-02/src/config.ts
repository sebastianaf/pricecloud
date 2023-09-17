import dotenv from 'dotenv';
import pino from 'pino';
import NodeCache from 'node-cache';
import { Pool, PoolConfig } from 'pg';
import tmp from 'tmp';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });
dotenv.config();

const createPaths = [
  path.join(__dirname, '../data'),
  path.join(__dirname, '../data/products'),
];

createPaths.forEach((path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
});

let pgPool: Pool;
async function pg(): Promise<Pool> {
  if (!pgPool) {
    let poolConfig: PoolConfig = {
      user: process.env.POSTGRES_USER || 'postgres',
      database: process.env.POSTGRES_DB || 'cloud_pricing',
      password: process.env.POSTGRES_PASSWORD || '',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      host: process.env.POSTGRES_HOST || 'localhost',
      max: Number(process.env.POSTGRES_MAX_CLIENTS) || 10,
    };

    if (process.env.POSTGRES_URI) {
      poolConfig = {
        connectionString:
          process.env.POSTGRES_URI ||
          'postgresql://postgres:@localhost:5432/cloud_pricing',
      };
    }

    pgPool = new Pool(poolConfig);
  }
  return pgPool;
}

function generateGcpKeyFile(): string {
  if (process.env.GCP_KEY_FILE) {
    return process.env.GCP_KEY_FILE;
  }

  const tmpFile = tmp.fileSync({ postfix: '.json' });
  tmp.setGracefulCleanup();

  fs.writeFileSync(tmpFile.name, process.env.GCP_KEY_FILE_CONTENT || '');
  return tmpFile.name;
}

const loggerOpts: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
};

if (process.env.NODE_ENV !== 'production') {
  loggerOpts.transport = {
    target: 'pino-pretty',
  };
}

const logger = pino(loggerOpts);

const cache = new NodeCache();

const config = {
  logger,
  pg,
  productTableName: 'products',
  statsTableName: 'stats',
  installsTableName: 'installs',
  infracostPricingApiEndpoint:
    process.env.INFRACOST_PRICING_API_ENDPOINT ||
    'https://pricing.api.infracost.io',
  infracostDashboardApiEndpoint:
    process.env.INFRACOST_DASHBOARD_API_ENDPOINT ||
    'https://dashboard.api.infracost.io',
  disableTelemetry:
    process.env.DISABLE_TELEMETRY?.toLowerCase() === 'true' ||
    process.env.DISABLE_TELEMETRY === '1',
  infracostAPIKey: process.env.INFRACOST_API_KEY,
  selfHostedInfracostAPIKey: process.env.SELF_HOSTED_INFRACOST_API_KEY,
  cache,
  port: Number(process.env.PORT) || 4000,
  gcpApiKey: process.env.GCP_API_KEY,
  gcpKeyFile: generateGcpKeyFile(),
  gcpProject: process.env.GCP_PROJECT,
};

export default config;
