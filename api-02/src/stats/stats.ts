import { Pool, PoolClient } from 'pg';
import format from 'pg-format';
import config from '../config';
import { camelKeys } from '../db/helpers';

type Stats = {
  createdAt: Date;
  pricesLastSuccessfullyUpdatedAt: Date;
  pricesLastUpdateSuccessful: boolean;
  totalRuns: number;
  ciRuns: number;
  nonCiRuns: number;
  nonCiInstalls: number;
};

export async function setPriceUpdateSuccessful(
  client?: PoolClient | Pool
): Promise<void> {
  if (!client) {
    // eslint-disable-next-line no-param-reassign
    client = await config.pg();
  }

  await client.query(
    format(
      `UPDATE %I SET
      updated_at = NOW(),
      prices_last_successfully_updated_at = NOW(),
      prices_last_update_successful = true`,
      config.statsTableName
    )
  );
}

export async function setPriceUpdateFailed(
  client?: PoolClient | Pool
): Promise<void> {
  if (!client) {
    // eslint-disable-next-line no-param-reassign
    client = await config.pg();
  }

  await client.query(
    format(
      `UPDATE %I SET
      updated_at = NOW(),
      prices_last_update_successful = false`,
      config.statsTableName
    )
  );
}

export async function incrementCounters(
  isCi: boolean,
  installId: string
): Promise<void> {
  const pool = await config.pg();

  if (!isCi && installId) {
    const sql = format(
      `
      INSERT INTO %I (install_id) VALUES (%L)
      ON CONFLICT (install_id) DO NOTHING`,
      config.installsTableName,
      installId
    );

    await pool.query(sql);
  }

  const sql = format(
    `UPDATE %I SET \
    updated_at = NOW(),
    total_runs = total_runs + 1
    ${isCi ? ', ci_runs = ci_runs + 1' : ', non_ci_runs = non_ci_runs + 1'}`,
    config.statsTableName
  );

  await pool.query(sql);
}

export async function fetchStats(): Promise<Stats | null> {
  const pool = await config.pg();

  const sql = format(
    `
    SELECT
      stats.created_at,
      stats.prices_last_successfully_updated_at,
      stats.prices_last_update_successful,
      stats.total_runs,
      stats.ci_runs,
      stats.non_ci_runs,
      (SELECT COUNT(installs.install_id) FROM %I) as non_ci_installs
    FROM %I as stats
    LIMIT 1
    `,
    config.installsTableName,
    config.statsTableName
  );

  const response = await pool.query(sql);

  return response.rows.length > 0
    ? (camelKeys(response.rows[0]) as Stats)
    : null;
}

export async function fetchLastSuccessfullyUpdatedAt(): Promise<Date | null> {
  const pool = await config.pg();

  const sql = format(
    `
    SELECT
      stats.prices_last_successfully_updated_at
    FROM %I as stats
    LIMIT 1
    `,
    config.statsTableName
  );

  const response = await pool.query(sql);

  return response.rows.length > 0
    ? (camelKeys(response.rows[0]) as Stats).pricesLastSuccessfullyUpdatedAt
    : null;
}
