import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RoleEntity } from './entity/role.entity';

@Injectable()
export class RoleRepository extends Repository<RoleEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RoleEntity, dataSource.createEntityManager());
  }

  async getPermissions() {
    return await this.createQueryBuilder('roles')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .getMany();
  }

  async getRoleByCode(code: string): Promise<RoleEntity | null> {
    return await this.createQueryBuilder('roles').where({ code }).getOne();
  }
  async getRoleByUuid(uuid: string): Promise<RoleEntity> {
    return await this.createQueryBuilder('roles').where({ uuid }).getOne();
  }
}
