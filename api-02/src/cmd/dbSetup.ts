import { PoolClient } from 'pg';
import config from '../config';
import {
  createInstallsTable,
  createProductsTable,
  createProductsTableIndex,
  createStatsTable,
} from '../db/setup';
import { SocketEvent } from '../socket/event';
import { Socket } from 'socket.io';

const attempts = 3;
const backOffSecs = 10;

export async function run(socket: Socket, event: SocketEvent): Promise<void> {
  config.logAndEmit(socket, event, 'Inciando: Configuracion BD');
  const pool = await config.pg();

  let client: PoolClient | null = null;

  try {
    for (let i = 0; i < attempts; i++) {
      try {
        client = await pool.connect();
        break;
      } catch (e: any) {
        config.logAndEmit(
          socket,
          event,
          `Esperando a PostgreSQL: ${e.message}`
        );
        await new Promise((resolve) => {
          setTimeout(resolve, backOffSecs * 1000);
        });
      }
    }

    if (client === null) {
      throw new Error('Conexión fallida a PostgreSQL');
    }

    await client.query('BEGIN');
    await createProductsTable(client, config.productTableName, true);
    await createProductsTableIndex(client, config.productTableName, true);
    await createStatsTable(client, config.statsTableName, true);
    await createInstallsTable(client, config.installsTableName, true);
    await client.query('COMMIT');
  } catch (e) {
    client && (await client.query('ROLLBACK'));
  } finally {
    client && client.release();
    config.logAndEmit(socket, event, 'Completado: Configuracion BD');
  }
}
