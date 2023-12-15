import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { io, Socket } from 'socket.io-client';
import { SocketEventInterface } from './interfaces/socket-event.interface';
import { welcomeData } from './data/welcome.data';

@WebSocketGateway({ namespace: '/price', cors: '*' })
export class PriceGateway {
  @WebSocketServer()
  server: Server;
  private api02: Socket;

  afterInit(server: Server) {
    this.api02 = io(
      `ws://${process.env.API02_HOST}:${process.env.API02_PORT}/price`,
    );

    this.api02.on(SocketEventInterface.consoleEvent, (data: string) => {
      this.server.emit(SocketEventInterface.consoleEvent, data);
    });
  }

  handleConnection(client: Socket, ...args: any[]) {
    client.emit(SocketEventInterface.consoleEvent, welcomeData);
  }

  handleDisconnect(client: Socket) {}

  @SubscribeMessage(SocketEventInterface.consoleEvent)
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() socket: Socket,
  ) {
    this.api02.emit(SocketEventInterface.consoleEvent, data);
  }
}
