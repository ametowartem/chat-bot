import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { ConfigService } from '../../core/service/config.service';
import { JwtService } from '@nestjs/jwt';
import { REDIS_PROVIDER } from '../../core/core.provider';
import IORedis from 'ioredis';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PayloadInterface } from '../interface/payload.interface';
import * as moment from 'moment';
import { UserStatus } from '../../user/const/user.status.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Inject(REDIS_PROVIDER)
  private readonly redis: IORedis;

  async signIn(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    const isMatch = bcrypt.compare(password, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const jti = uuidv4();

    const payload: PayloadInterface = {
      username: username,
      uuid: user.uuid,
      jti: jti,
      exp: moment().add(this.configService.exp, 'seconds').unix(),
      role: user.role,
    };

    if (user.status === UserStatus.Deleted) {
      throw new UnauthorizedException('User account was deleted');
    }

    this.redis.sadd(this.configService.getUserTokenWhiteList(user.uuid), jti);

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.jwtSecret,
      }),
    };
  }

  async checkRedisIsMember(payload: PayloadInterface): Promise<boolean> {
    return await this.redis
      .sismember(
        this.configService.getUserTokenWhiteList(payload.uuid),
        payload.jti,
      )
      .then((value) => {
        return value !== 0;
      });
  }
  async logout(payload: PayloadInterface) {
    await this.redis.srem(
      this.configService.getUserTokenWhiteList(payload.uuid),
      payload.jti,
    );
  }
}
