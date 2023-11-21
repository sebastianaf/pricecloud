import { run as dbSetup } from './cmd/dbSetup';
import { run as dataDownload } from './cmd/dataDownload';

import SocketIO from 'socket.io';
import config from './config';

let cmd: SocketIO.Namespace;
let io: SocketIO.Server;

const initializeSocket = (io: SocketIO.Server) => {
  cmd = io.of('/cmd');

  cmd.on('connection', (socket) => {
    socket.emit('log', 'Bienvenido a la consola de comandos de Pricecloud');
  });
};

export { cmd, initializeSocket, io };