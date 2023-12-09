import { run as dbSetup } from './cmd/dbSetup';
import { run as dataDownload } from './cmd/dataDownload';

import SocketIO from 'socket.io';
import config from './config';

let cmd: SocketIO.Namespace;
let io: SocketIO.Server;

const initializeSocket = (io: SocketIO.Server) => {
  cmd = io.of('/cmd');

  cmd.on('connection', (socket) => {
    socket.emit('cmd', 'Bienvenido a la consola de comandos de Pricecloud');

    socket.on('mensaje', (msg) => {
      if (msg === 'palabra clave') {
        socket.emit(
          '/cmd',
          'Bienvenido a la consola de comandos de Pricecloud'
        );
        procedure();
      }
    });
  });
};

const procedure = async () => {
  console.log('Flag para procedimiento llamado');
};

export { cmd, initializeSocket, io };
