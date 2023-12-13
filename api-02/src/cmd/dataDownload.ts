import fetch, { Response } from 'node-fetch';
import fs from 'fs';
import yargs from 'yargs';
import config from '../config';
import { Socket } from 'socket.io';
import { SocketEvent } from '../socket/event';

export async function run(socket: Socket, event: SocketEvent) {
  config.logAndEmit(socket, event, 'Iniciando: Descargando datos');
  const argv = await yargs
    .usage(
      'Usage: $0 --out=[output file, default: ./data/products/products.csv.gz ]'
    )
    .options({
      out: { type: 'string', default: './data/products/products.csv.gz' },
    }).argv;

  let latestResp: Response;

  if (!config.infracostAPIKey) {
    config.logAndEmit(
      socket,
      event,
      'Error de conexión a Infracost, KEY incorrecta'
    );
    config.logAndEmit(
      socket,
      event,
      'Una nueva llave puede ser obtenida en  el CLI de infracost CLI con "infracost auth login" en  ~/.config/infracost/credentials.yml'
    );
    return;
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

      config.logAndEmit(
        socket,
        event,
        `Hubo un error descargando la data: HTTP ${latestResp.status}: ${body}`
      );

      try {
        const errorData = (await JSON.parse(body)) as { error: string };
        if (
          latestResp.status === 403 &&
          errorData.error === 'API key invalida'
        ) {
          config.logAndEmit(
            socket,
            event,
            'No tiene permiso para descargar la data. Por favor configure una clave INFRACOST_API_KEY valida.'
          );
          config.logAndEmit(
            socket,
            event,
            'Una nueva llave puede ser obtenida en  el CLI de infracost CLI con "infracost auth login" en  ~/.config/infracost/credentials.yml'
          );
        }
      } catch (e) {
        // eslint-disable no-empty
      }

      return;
    }
  } catch (e) {
    config.logAndEmit(socket, event, `hubo un error descargando la data: ${e}`);
    return;
  }

  const { downloadUrl } = (await latestResp.json()) as { downloadUrl: string };
  config.logAndEmit(socket, event, `Iniciando descarga desde infracost`);

  const writer = fs.createWriteStream(argv.out);

  await new Promise((resolve, reject) => {
    let size = 0;
    fetch(downloadUrl, {
      method: 'get',
    }).then((resp) => {
      size = parseInt(resp.headers.get('content-length') || '0', 10);
      const progressUpdateInterval = 1000;
      let lastUpdateTime = Date.now();
      let totalBytesRead = 0;

      resp.body.on('data', (chunk: { length: number }) => {
        const now = Date.now();
        totalBytesRead += chunk.length;

        if (now - lastUpdateTime >= progressUpdateInterval) {
          lastUpdateTime = now;
          const progress = `Descargando archivo: ${(totalBytesRead !== 0
            ? (totalBytesRead / size) * 100
            : 0
          ).toFixed(2)}%`;

          config.logAndEmit(socket, event, progress);
        }
      });

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
  config.logAndEmit(socket, event, 'Completado: descarga de datos de precios');
}
