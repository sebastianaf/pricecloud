import glob from 'glob';
import fs from 'fs';
import zlib from 'zlib';
import { promisify } from 'util';
import { pipeline } from 'stream';

import { from as copyFrom } from 'pg-copy-streams';
import { PoolClient } from 'pg';
import format from 'pg-format';
import yargs from 'yargs';
import config from '../config';
import {
  createProductsTable,
  createProductsTableIndex,
  renameProductsTable,
} from '../db/setup';
import { setPriceUpdateFailed, setPriceUpdateSuccessful } from '../stats/stats';
import { Socket } from 'socket.io';
import { SocketEvent } from '../socket/event';

export async function run(socket: Socket, event: SocketEvent): Promise<void> {
  config.logAndEmit(socket, event, 'Iniciando: Cargando data a la BD');
  const pool = await config.pg();

  const argv = await yargs
    .usage(
      'Usage: $0 --path=[ location of *.csv.gz files, default: ./data/products ]'
    )
    .options({
      path: { type: 'string', default: './data/products' },
    }).argv;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(format(`DROP TABLE IF EXISTS %I`, 'ProductLoad'));

    await createProductsTable(client, 'ProductLoad');

    await loadFiles(socket, event, argv.path, client);

    await createProductsTableIndex(client, 'ProductLoad');

    await replaceProductTable(client);

    await setPriceUpdateSuccessful(client);

    await client.query('COMMIT');
    config.logAndEmit(socket, event, 'Completado: carga de data a la BD');
  } catch (e) {
    await client.query('ROLLBACK');

    await setPriceUpdateFailed(client);

    throw e;
  } finally {
    client.release();
  }
}

async function replaceProductTable(client: PoolClient) {
  await client.query(
    format(`DROP TABLE IF EXISTS %I`, config.productTableName)
  );

  await renameProductsTable(client, 'ProductLoad', config.productTableName);
}

async function loadFiles(
  socket: Socket,
  event: SocketEvent,
  path: string,
  client: PoolClient
): Promise<void> {
  const filenames = glob.sync(`${path}/*.csv.gz`);
  if (filenames.length === 0) {
    config.logAndEmit(
      socket,
      event,
      `No se pueden cargar los precios: datos no disponibles en '${path}/*.csv.gz'`
    );
  }
  config.logAndEmit(
    socket,
    event,
    `Descargue la ultima version con "data:download"`
  );

  for (const filename of filenames) {
    config.logAndEmit(socket, event, `Cargando desde archivo: ${filename}`);
    await loadFile(socket, event, client, filename);
  }
}

async function loadFile(
  socket: Socket,
  event: SocketEvent,
  client: PoolClient,
  filename: string
): Promise<void> {
  const promisifiedPipeline = promisify(pipeline);

  const gunzip = zlib.createGunzip().on('error', (e) => {
    config.logAndEmit(
      socket,
      event,
      `Hubo un error al descomprimir el archivo: ${e.message}`
    );
    config.logAndEmit(
      socket,
      event,
      `Descargue la ultima version con "data:download"`
    );
  });

  const pgCopy = client.query(
    copyFrom(`
    COPY "ProductLoad" FROM STDIN WITH (
      FORMAT csv,
      HEADER true,
      DELIMITER ',',
      FORCE_NOT_NULL ("productFamily")
      )`)
  );

  const { size } = fs.statSync(filename);

  const progressUpdateInterval = 1000;
  let lastUpdateTime = Date.now();
  let totalBytesRead = 0;

  const readStream = fs.createReadStream(filename);
  readStream.on('data', (buffer) => {
    const now = Date.now();
    totalBytesRead += buffer.length;

    if (now - lastUpdateTime >= progressUpdateInterval) {
      lastUpdateTime = now;
      const progress = `Cargando archivo: ${(totalBytesRead !== 0
        ? (totalBytesRead / size) * 100
        : 0
      ).toFixed(2)}%`;

      config.logAndEmit(socket, event, progress);
    }
  });

  return promisifiedPipeline(readStream, gunzip, pgCopy);
}
