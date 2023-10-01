import { Module } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { PermissionService } from '../permission/service/permission.service';
import { CoreModule } from '../core/core.module';
import { RoleService } from './service/role.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [CoreModule, LoggerModule],
  providers: [RoleRepository, PermissionService, RoleService],
  exports: [PermissionService, RoleService],
})
export class RoleModule {}
