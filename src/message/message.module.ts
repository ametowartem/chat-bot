import { Module } from '@nestjs/common';
import { MessageRepository } from './repository/message.repository';
import { MessageService } from './service/message.service';

@Module({
  imports: [],
  providers: [MessageRepository, MessageService],
  exports: [MessageRepository, MessageService],
})
export class MessageModule {}
