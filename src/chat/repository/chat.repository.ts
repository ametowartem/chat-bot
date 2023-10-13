import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ChatEntity } from '../entity/chat.entity';

@Injectable()
export class ChatRepository extends Repository<ChatEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ChatEntity, dataSource.createEntityManager());
  }

  async findByChatName(chatName: string) {
    return await this.findOneBy({ chatName });
  }

  async getChatHistory(chatName: string) {
    return await this.createQueryBuilder('chats')
      .where({ chatName })
      .leftJoinAndSelect('chats.messages', 'messages')
      .leftJoinAndSelect('messages.user', 'user')
      .orderBy('messages.timeSending', 'ASC')
      .getOne();
  }
}
