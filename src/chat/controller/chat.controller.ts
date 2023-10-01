import { Controller, Get } from '@nestjs/common';
import { ChatService } from '../service/chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('chats')
  getChats() {
    return this.chatService.getChats();
  }
}
