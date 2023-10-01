import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserService } from './service/user.service';
import { RoleModule } from '../role/role.module';
import { CoreModule } from '../core/core.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [RoleModule, CoreModule, LoggerModule],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
