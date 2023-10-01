import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionEntity } from '../../permission/entity/permission.entity';
import { UserEntity } from '../../user/entity/user.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;
  @Column()
  name: string;
  @Column()
  code: string;

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles)
  @JoinTable({
    name: 'roles_permissions',
    joinColumn: {
      name: 'role_uuid',
      referencedColumnName: 'uuid',
    },
    inverseJoinColumn: {
      name: 'permission_uuid',
      referencedColumnName: 'uuid',
    },
  })
  permissions?: PermissionEntity[];

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];

  constructor(
    name: string,
    code: string,
    permissions: PermissionEntity[],
    users: UserEntity[],
    uuid?: string,
  ) {
    this.uuid = uuid;
    this.name = name;
    this.code = code;
    this.permissions = permissions;
    this.users = users;
  }
}
