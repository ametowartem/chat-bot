import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { IChatDto } from '../interface/chat-message.interface';
import { IChatJoin } from '../interface/chat-join.interface';
import { ChatService } from '../service/chat.service';
import { ChatEntity } from '../entity/chat.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from '../../auth/guard/ws.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server;
  constructor(private readonly chatService: ChatService) {}

  // добавить авторизацию и по ней добавлять потом автора сообщения
  @ApiBearerAuth()
  @UseGuards(WsGuard)
  @SubscribeMessage('message')
  handleMessage(@MessageBody() dto: IChatDto) {
    console.log(dto);
    this.server.emit(dto.chatName, dto.message);
    return dto.message;
  }
  @ApiBearerAuth()
  @UseGuards(WsGuard)
  @SubscribeMessage('log')
  async joinChat(@MessageBody() dto: IChatJoin) {
    console.log(dto);
    const newChat = new ChatEntity(dto.chatName);
    console.log(newChat);
    await this.chatService.addChat(newChat);
    this.server.emit(
      'log',
      `Пользователь ${dto.user} присоединился в чат ${dto.chatName}`,
    );
  }
}
