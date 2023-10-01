import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ChatEntity } from '../entity/chat.entity';

@Injectable()
export class ChatRepository extends Repository<ChatEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ChatEntity, dataSource.createEntityManager());
  }

  async findByChatName(chat: ChatEntity) {
    return await this.findBy({ chatName: chat.chatName });
  }
}
