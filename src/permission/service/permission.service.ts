import { Inject, Injectable } from '@nestjs/common';
import { RoleRepository } from '../../role/role.repository';
import { REDIS_PROVIDER } from '../../core/core.provider';
import IORedis from 'ioredis';
import { ConfigService } from '../../core/service/config.service';
import { UserPermission } from '../const/permission.enum';

@Injectable()
export class PermissionService {
  @Inject(REDIS_PROVIDER)
  private readonly redis: IORedis;

  protected readonly rolePermissionsKey = 'roles_permissions';

  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly configService: ConfigService,
  ) {}

  async checkRolesPermission(
    roleCode: string,
    permissionCode: UserPermission[],
  ) {
    const rolesPermissionsRaw = await this.redis.get('role_permission_key');
    let rolesPermissions: Record<string, string[]>;

    if (rolesPermissionsRaw) {
      rolesPermissions = JSON.parse(rolesPermissionsRaw);
    } else {
      rolesPermissions = await this.refreshRolesPermissions();
    }

    if (!permissionCode) {
      return true;
    }

    permissionCode.forEach((el) => {
      if (!rolesPermissions[roleCode].includes(el)) {
        return false;
      }
    });

    return true;
  }

  async refreshRolesPermissions() {
    const roles = await this.getPermissions();
    const rolesPermissions = {};

    for (const role of roles) {
      const key = role.code;
      rolesPermissions[key] = role.permissions.map((el) => el.code);
    }

    await this.redis.setex(
      this.rolePermissionsKey,
      this.configService.redisExp,
      JSON.stringify(rolesPermissions),
    );

    return rolesPermissions;
  }

  async getPermissions() {
    return await this.roleRepository.getPermissions();
  }
}
