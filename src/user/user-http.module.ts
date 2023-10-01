import { Module } from '@nestjs/common';
import { UserControllerV1 } from './controller/user.controller.v1';
import { RoleModule } from '../role/role.module';
import { CoreModule } from '../core/core.module';
import { UserModule } from './user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [RoleModule, CoreModule, UserModule, AuthModule],
  controllers: [UserControllerV1],
})
export class UserHttpModule {}
