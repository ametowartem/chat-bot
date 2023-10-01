import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../repository/chat.repository';
import { ChatEntity } from '../entity/chat.entity';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  getChats() {
    return this.chatRepository.find();
  }

  async addChat(chat: ChatEntity) {
    const getChat = await this.chatRepository.findByChatName(chat);
    if (!getChat.length) {
      await this.chatRepository.insert(chat);
    }
  }
}
