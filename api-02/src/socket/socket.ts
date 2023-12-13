import { run as dataStatus } from '../cmd/dataStatus';
import { run as dbSetup } from '../cmd/dbSetup';
import { run as dataDownload } from '../cmd/dataDownload';
import { run as dataDump } from '../cmd/dataDump';
import { run as dataLoad } from '../cmd/dataLoad';
import { run as dataScrape } from '../cmd/dataScrape';
import { run as jobUpdate } from '../cmd/jobUpdate';

import SocketIO, { Socket } from 'socket.io';
import { welcomeMessage } from '../cmd/messages/welcome.mesage';
import { SocketEvent } from './event';
import { helpMessage } from '../cmd/messages/help.message';
import { CommandInterface } from './commands';

let cmd: SocketIO.Namespace;
let io: SocketIO.Server;

const initializeSocket = (io: SocketIO.Server) => {
  cmd = io.of('/price');

  cmd.on('connection', (socket) => {
    welcomeCommand(SocketEvent.consoleEvent, socket);

    socket.on(SocketEvent.consoleEvent, (msg) => {
      socket.emit(SocketEvent.consoleEvent, `pricecloud-cli: ${msg}`);
      runConsoleCommand(socket, SocketEvent.consoleEvent, msg);
    });
  });
};

const welcomeCommand = (event: string, socket: Socket) => {
  socket.emit(event, welcomeMessage);
};

const formatCommand = (command: string) => {
  return command.trim().toLowerCase();
};

const runConsoleCommand = async (
  socket: Socket,
  socketEvent: SocketEvent,
  command: string
) => {
  switch (formatCommand(command)) {
    case CommandInterface.help:
      socket.emit(socketEvent, helpMessage);
      break;
    case CommandInterface.dataStatus:
      await dataStatus(socket, socketEvent);
      break;
    case CommandInterface.dbSetup:
      await dbSetup(socket, socketEvent);
      break;
    case CommandInterface.dataDownload:
      await dataDownload(socket, socketEvent);
      break;
    case CommandInterface.dataDump:
      await dataDump(socket, socketEvent);
      break;
    case CommandInterface.dataLoad:
      await dataLoad(socket, socketEvent);
      break;
    case CommandInterface.dataScrape:
      await dataScrape(socket, socketEvent);
      break;
    case CommandInterface.jobUpdate:
      await jobUpdate(socket, socketEvent);
      break;
    default:
      socket.emit(
        SocketEvent.consoleEvent,
        `Comando '${command}' desconocido. Escriba help para listar los comandos disponibles`
      );
  }
};

export { cmd, initializeSocket, io };
