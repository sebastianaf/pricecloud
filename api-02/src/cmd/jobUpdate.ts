import glob from 'glob';
import config from '../config';
import { fetchLastSuccessfullyUpdatedAt } from '../stats/stats';
import { Socket } from 'socket.io';
import { SocketEvent } from '../socket/event';
import { run as dataDownload } from './dataDownload';
import { run as dataLoad } from './dataLoad';

export async function run(socket: Socket, event: SocketEvent): Promise<void> {
  config.logAndEmit(socket, event, 'Iniciando: Actualizacion de DB');
  const dumpFiles = glob.sync(`./data/products/*.csv.gz`);
  const dumpFileExists = dumpFiles.length !== 0;

  const lastUpdatedAt = await fetchLastSuccessfullyUpdatedAt();
  const upToDate =
    lastUpdatedAt && lastUpdatedAt.getTime() > Date.now() - 24 * 60 * 60 * 1000;

  if (dumpFileExists && lastUpdatedAt && upToDate) {
    config.logAndEmit(
      socket,
      event,
      `Omitiendo la actualización porque la base de datos de precios ya se actualizó en las últimas 24 horas (${lastUpdatedAt.toISOString()}).`
    );
    return;
  }

  await dataDownload(socket, event);
  await dataLoad(socket, event);

  config.logAndEmit(socket, event, 'Completado: Actualizacion de DB');
}
