import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CoreModule } from '../core/core.module';
import { ConfigService } from '../core/service/config.service';
import { AuthControllerV1 } from './controller/auth.controller.v1';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

@Module({
  controllers: [AuthControllerV1],
  imports: [
    JwtModule.registerAsync({
      imports: [CoreModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.jwtSecret,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    CoreModule,
    RoleModule,
  ],
  providers: [AuthService, JwtService],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
