import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../repository/message.repository';
import { MessageEntity } from '../entity/message.entity';
import { IChangeMessage } from '../interface/change-message.interface';
import { IDeleteMessage } from '../interface/delete-message.interface';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async saveMessage(message: MessageEntity) {
    await this.messageRepository.save(message);
  }

  async changeMessage(dto: IChangeMessage) {
    return await this.messageRepository.changeMessage(dto);
  }

  async deleteMessage(dto: IDeleteMessage) {
    return await this.messageRepository.deleteMessage(dto);
  }
}
