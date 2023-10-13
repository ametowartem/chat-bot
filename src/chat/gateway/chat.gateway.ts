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
import { UseFilters, UseGuards } from '@nestjs/common';
import { WsGuard } from '../../auth/guard/ws.guard';
import { MessageEntity } from '../../message/entity/message.entity';
import { UserWs } from '../../user/decorator/user-ws.decorator';
import { UserService } from '../../user/service/user.service';
import { MessageService } from '../../message/service/message.service';
import { Server } from 'socket.io';
import { IChangeMessage } from '../../message/interface/change-message.interface';
import { IDeleteMessage } from '../../message/interface/delete-message.interface';
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException, HttpException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as WebSocket;
    const data = host.switchToWs().getData();
    const error =
      exception instanceof WsException
        ? exception.getError()
        : exception.getResponse();
    const details = error instanceof Object ? { ...error } : { message: error };
    client.send(
      JSON.stringify({
        event: 'error',
        data: {
          id: (client as any).id,
          rid: data.rid,
          ...details,
        },
      }),
    );
  }
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {}

  @UseGuards(WsGuard)
  @SubscribeMessage('message')
  @UseFilters(WebsocketExceptionsFilter)
  async handleMessage(
    @MessageBody() dto: IChatDto,
    @UserWs() userUuid: string,
  ) {
    const chat = await this.chatService.findByChatName(dto.chatName);
    const user = await this.userService.findOneByUuid(userUuid);
    const newMessage = new MessageEntity(dto.message, user, chat);
    await this.messageService.saveMessage(newMessage);
    this.server.emit(
      dto.chatName,
      `Пользователь ${user.username} написал ${dto.message} в чат ${dto.chatName}`,
    );
    return dto.message;
  }

  @ApiBearerAuth()
  @UseGuards(WsGuard)
  @SubscribeMessage('log')
  async joinChat(@MessageBody() dto: IChatJoin) {
    const newChat = new ChatEntity(dto.chatName);
    await this.chatService.addChat(newChat);
    this.server.emit(
      'log',
      `Пользователь ${dto.user} присоединился в чат ${dto.chatName}`,
    );
  }

  @ApiBearerAuth()
  @UseGuards(WsGuard)
  @SubscribeMessage('history')
  async getHistory(@MessageBody() chatName: string) {
    const history = await this.chatService.getChatHistory(chatName);
    this.server.emit('history', history);
  }

  @ApiBearerAuth()
  @UseGuards(WsGuard)
  @SubscribeMessage('message:put')
  async changeMessage(
    @MessageBody() dto: IChangeMessage,
    @UserWs() userUuid: string,
  ) {
    dto.user = await this.userService.findOneByUuid(userUuid);
    const newMessage = this.messageService.changeMessage(dto);
    this.server.emit('message:put', newMessage);
  }

  @ApiBearerAuth()
  @UseGuards(WsGuard)
  @SubscribeMessage('message:delete')
  async deleteMessage(
    @MessageBody() dto: IDeleteMessage,
    @UserWs() userUuid: string,
  ) {
    dto.user = await this.userService.findOneByUuid(userUuid);
    const newMessage = this.messageService.deleteMessage(dto);
    this.server.emit('message:delete', newMessage);
  }
}
