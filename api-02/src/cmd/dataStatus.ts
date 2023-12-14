import { PoolClient } from 'pg';
import format from 'pg-format';
import config from '../config';
import { Socket } from 'socket.io';
import { SocketEvent } from '../socket/event';

const attempts = 3;
const backOffSecs = 10;

export async function run(socket: Socket, event: SocketEvent): Promise<void> {
  config.logAndEmit(socket, event, 'Iniciando: Data status');

  const pool = await config.pg();

  let client: PoolClient | null = null;

  for (let i = 0; i < attempts; i++) {
    try {
      client = await pool.connect();
      break;
    } catch (e) {
      config.logAndEmit(
        socket,
        event,
        `Esperando disponibilidad de PostgreSQL: ${e.message}`
      );
      await new Promise((resolve) => {
        setTimeout(resolve, backOffSecs * 1000);
      });
    }
  }

  try {
    if (client === null) {
      const msg = `Error al conectar a la BD después de ${attempts} intento(s)`;
      config.logAndEmit(socket, event, msg);
      await new Promise((resolve) => {
        setTimeout(resolve, backOffSecs * 1000);
      });
      throw new Error(msg);
    }

    const counts = await client.query(
      format(
        `SELECT "vendorName", count(*) as "productCount" FROM %I GROUP BY "vendorName"`,
        config.productTableName
      )
    );
    config.logAndEmit(
      socket,
      event,
      `\n${JSON.stringify(counts.rows, null, 2)}`
    );
  } catch (e) {
    config.logAndEmit(socket, event, `Error: ${e.message}`);
  } finally {
    config.logAndEmit(socket, event, 'Completado: Data status');
    client && client.release();
  }
}
