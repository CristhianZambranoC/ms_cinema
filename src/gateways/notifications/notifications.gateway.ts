import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', //si se quiere conectar desde cualquier origen, se puede usar '*', pero en producción es recomendable especificar los orígenes permitidos con las direcciones Ip.
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect //detectan cuando un cliente se conecta o desconecta del gateway.
{
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server?: Server; 

  handleConnection(client: Socket): void {
    this.logger.log(`Nuevo dispositivo conectado: ${client.id}`); //el id del cliente se saca del token, desde el frontend. 
    this.logger.debug(`Query del socket: ${JSON.stringify(client.handshake.query)}`);

    client.emit('new_notification', { hello: 'world' });
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Dispositivo desconectado: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: unknown): string {
    this.logger.log(`Mensaje recibido: ${JSON.stringify(data)}`);
    return 'Mensaje recibido correctamente';
  }

  // Publica un evento a todos los clientes conectados (broadcast).
  broadcastNotification(payload: { event: string; data: unknown }): void {
    this.server?.emit(payload.event, payload.data);
  }
}
