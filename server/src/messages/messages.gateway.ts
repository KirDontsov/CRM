import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessagesService } from './messages.service';
import { CreateMessageInput } from './dto/create-message.input';

@WebSocketGateway(8082, { cors: { origin: '*' } })
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage')
  async createMessage(@MessageBody() createMessageInput: CreateMessageInput) {
    const message = await this.messagesService.createMessage(
      createMessageInput,
    );
    this.server?.emit('message', message);
    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAllByUserId(@MessageBody() createMessageInput: CreateMessageInput) {
    return this.messagesService.findAllByUserId(createMessageInput);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.messagesService.findById(client.id);
    client.broadcast.emit('typing', isTyping);
    return user;
  }
}
