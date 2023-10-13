import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../repository/chat.repository';
import { ChatEntity } from '../entity/chat.entity';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  getChats() {
    return this.chatRepository.find();
  }

  getChatHistory(chatName: string) {
    return this.chatRepository.getChatHistory(chatName);
  }

  async findByChatName(chatName: string) {
    return await this.chatRepository.findByChatName(chatName);
  }

  async addChat(chat: ChatEntity) {
    const getChat = await this.chatRepository.findByChatName(chat.chatName);
    if (!getChat) {
      await this.chatRepository.insert(chat);
    }
  }
}
