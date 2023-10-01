import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as process from 'process';
import { ChatEntity } from './chat/entity/chat.entity';
import { LoggerEntity } from './logger/entity/logger.entity';
import { PermissionEntity } from './permission/entity/permission.entity';
import { UserEntity } from './user/entity/user.entity';
import { RoleEntity } from './role/entity/role.entity';
import { MessageEntity } from "./message/entity/message.entity";

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    ChatEntity,
    LoggerEntity,
    PermissionEntity,
    UserEntity,
    RoleEntity,
    MessageEntity,
  ],
  migrations: ['./src/migrations/*.ts'],
});
