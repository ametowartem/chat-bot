import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from '../../role/entity/role.entity';

@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;
  @Column()
  code: number;
  @Column()
  name: string;
  @Column()
  description: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  @JoinTable()
  roles: RoleEntity[];

  constructor(code: number, name: string, description: string, uuid?: string) {
    this.uuid = uuid;
    this.code = code;
    this.name = name;
    this.description = description;
  }
}
