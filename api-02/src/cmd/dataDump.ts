import fs from 'fs';
import zlib from 'zlib';
import { to as copyTo } from 'pg-copy-streams';
import yargs from 'yargs';
import { PoolClient } from 'pg';
import { promisify } from 'util';
import { pipeline } from 'stream';
import format from 'pg-format';
import config from '../config';
import { Socket } from 'socket.io';
import { SocketEvent } from '../socket/event';

export async function run(
  socket: Socket,
  socketEvent: SocketEvent
): Promise<void> {
  config.logAndEmit(socket, socketEvent, 'Iniciando: creando volcado de BD');
  const argv = await yargs
    .usage(
      'Usage: $0 --out=[output file, default: ./data/products/products.csv.gz ]'
    )
    .options({
      out: { type: 'string', default: './data/products/products.csv.gz' },
    }).argv;

  const pool = await config.pg();
  const client = await pool.connect();
  try {
    config.logAndEmit(socket, socketEvent, `Volcando archivo: ${argv.out}`);
    await dumpFile(socket, socketEvent, client, argv.out);
  } finally {
    client.release();
  }
}

async function dumpFile(
  socket: Socket,
  socketEvent: SocketEvent,
  client: PoolClient,
  outfile: string
): Promise<void> {
  const promisifiedPipeline = promisify(pipeline);

  const copyStream = client.query(
    copyTo(
      format(
        `
      COPY %I TO STDOUT WITH (
      FORMAT csv,
      HEADER true,
      DELIMITER ','
    )`,
        config.productTableName
      )
    )
  );

  const gzip = zlib.createGzip().on('error', (e) => {
    config.logAndEmit(socket, socketEvent, e.message.toString());
    return;
  });

  const fileStream = fs.createWriteStream(`${outfile}`);

  config.logAndEmit(
    socket,
    socketEvent,
    'Completado: creación de volcado de BD'
  );
  return promisifiedPipeline(copyStream, gzip, fileStream);
}
