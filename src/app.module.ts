import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ConfigService } from './core/service/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './chat/entity/chat.entity';
import { ChatModule } from './chat/chat.module';
import { LoggerModule } from './logger/logger.module';
import { LoggerEntity } from './logger/entity/logger.entity';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { PermissionEntity } from './permission/entity/permission.entity';
import { UserEntity } from './user/entity/user.entity';
import { RoleEntity } from './role/entity/role.entity';
import { UserHttpModule } from './user/user-http.module';
import { MessageEntity } from './message/entity/message.entity';

@Module({
  imports: [
    CoreModule,
    ChatModule,
    LoggerModule,
    AuthModule,
    UserHttpModule,
    RoleModule,
    TypeOrmModule.forRootAsync({
      imports: [CoreModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.databaseHost,
        port: configService.databasePort,
        username: configService.databaseUsername,
        password: configService.databasePassword,
        database: configService.databaseName,
        entities: [
          ChatEntity,
          LoggerEntity,
          PermissionEntity,
          UserEntity,
          RoleEntity,
          MessageEntity,
        ],
        migrations: ['src/migrations'],
        // logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
})
export class AppModule {}
