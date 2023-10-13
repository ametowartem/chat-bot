import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MessageEntity } from '../entity/message.entity';
import { IChangeMessage } from '../interface/change-message.interface';
import { IDeleteMessage } from '../interface/delete-message.interface';

@Injectable()
export class MessageRepository extends Repository<MessageEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(MessageEntity, dataSource.createEntityManager());
  }

  // сделать проверку на UUid
  async changeMessage(dto: IChangeMessage) {
    return await this.createQueryBuilder('messages')
      .update(MessageEntity)
      .set({ text: dto.text })
      .where({ uuid: dto.uuid })
      .andWhere({ user: dto.user })
      .execute();
  }

  async deleteMessage(dto: IDeleteMessage) {
    return await this.createQueryBuilder('messages')
      .delete()
      .where({ uuid: dto.uuid })
      .andWhere({ user: dto.user })
      .execute();
  }
}
