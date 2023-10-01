import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from '../interface/payload.interface';
import { ConfigService } from '../../core/service/config.service';
import { AuthService } from '../service/auth.service';
import { PermissionService } from '../../permission/service/permission.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs();
    const client = socket.getClient();
    const data = socket.getData();
    const [type, token] =
      client.handshake.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer') {
      throw new UnauthorizedException();
    }

    const requiredPermissions = client.permissions;

    if (!token) {
      throw new UnauthorizedException();
    }

    let result: boolean;

    try {
      const payload: PayloadInterface = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.jwtSecret,
        },
      );

      client.user = payload;

      result = await this.authService.checkRedisIsMember(payload);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }

    if (!result) {
      throw new UnauthorizedException();
    }

    const hasPermission = this.permissionService.checkRolesPermission(
      client.user.role.code,
      requiredPermissions,
    );

    if (!hasPermission) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
