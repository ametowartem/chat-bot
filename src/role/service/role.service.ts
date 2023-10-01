import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../role.repository';
import { RoleEntity } from '../entity/role.entity';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getRoleByCode(code: string): Promise<RoleEntity | null> {
    return this.roleRepository.getRoleByCode(code);
  }

  async getRoleByUuid(uuid: string): Promise<RoleEntity> {
    return this.roleRepository.getRoleByUuid(uuid);
  }
}
