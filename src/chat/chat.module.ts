import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatService } from './service/chat.service';
import { ChatRepository } from './repository/chat.repository';
import { CoreModule } from '../core/core.module';
import { AuthModule } from '../auth/auth.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [CoreModule, AuthModule, RoleModule, UserModule, MessageModule],
  providers: [ChatGateway, ChatService, ChatRepository],
  exports: [ChatService],
})
export class ChatModule {}
