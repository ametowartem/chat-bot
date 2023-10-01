import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStatus } from '../const/user.status.enum';
import { RoleEntity } from '../../role/entity/role.entity';
import { MessageEntity } from '../../message/entity/message.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;
  @Column({ name: 'first_name' })
  firstName: string;
  @Column()
  patronymic: string;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  status: UserStatus;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({ name: 'role_uuid' })
  role?: RoleEntity;

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];

  constructor(
    firstName: string,
    patronymic: string,
    username: string,
    password: string,
    lastName: string,
    status: UserStatus,
    role: RoleEntity,
    messages: MessageEntity[],
    uuid?: string,
  ) {
    this.uuid = uuid;
    this.firstName = firstName;
    this.patronymic = patronymic;
    this.username = username;
    this.password = password;
    this.lastName = lastName;
    this.status = status;
    this.role = role;
    this.messages = messages;
  }
}
