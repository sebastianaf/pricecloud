import { run as dbSetup } from './cmd/dbSetup';
import { run as dataDownload } from './cmd/dataDownload';

import SocketIO from 'socket.io';
import config from './config';

let cmd: SocketIO.Namespace;
let io: SocketIO.Server;

const initializeSocket = (io: SocketIO.Server) => {
  cmd = io.of('/cmd');

  cmd.on('connection', (socket) => {
    config.logger.info('Client connected to cmd');

    socket.on('db-setup', async (data) => {
      console.log(`-------------------------------------`);

      config.logger.info('Client requested db-setup');
      await dbSetup();
    });

    socket.on('data-download', async (data) => {
      io.emit(`log`, `Client data-download ${data}`);
      config.logger.info('Client data-download');
      await dataDownload();
    });
  });
};

export { cmd, initializeSocket, io };
