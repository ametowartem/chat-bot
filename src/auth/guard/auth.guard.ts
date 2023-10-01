import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserPermission } from '../../permission/const/permission.enum';
import { PERMISSIONS_KEY } from '../../permission/decorator/permission.decorator';
import { PayloadInterface } from '../interface/payload.interface';
import { ConfigService } from '../../core/service/config.service';
import { AuthService } from '../service/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PermissionService } from '../../permission/service/permission.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const requiredPermissions = this.reflector.getAllAndOverride<
      UserPermission[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

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

      request.user = payload;

      result = await this.authService.checkRedisIsMember(payload);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }

    if (!result) {
      throw new UnauthorizedException();
    }

    const hasPermission = this.permissionService.checkRolesPermission(
      request.user.role.code,
      requiredPermissions,
    );

    if (!hasPermission) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const headers = request.headers as { authorization?: string };

    const [type, token] = headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
