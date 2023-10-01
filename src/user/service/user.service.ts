import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { UserEntity } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserInterface } from '../interface/create-user.interface';
import { ConfigService } from '../../core/service/config.service';
import { RoleService } from '../../role/service/role.service';
import { UserRole } from '../../role/const/role.enum';
import { UserStatus } from '../const/user.status.enum';
import { IGetUsers } from '../interface/get-users.interface';
import { IChangeUser } from '../interface/change-user.interface';
import { LoggerService } from '../../logger/service/logger.service';
import { LoggerEntity } from '../../logger/entity/logger.entity';
import { LogType } from '../../logger/const/log-type.enum';
import { IDeleteUser } from '../interface/delete-user.interface';
import { REDIS_PROVIDER } from '../../core/core.provider';
import IORedis from 'ioredis';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly roleService: RoleService,
    private readonly loggerService: LoggerService,
  ) {}

  @Inject(REDIS_PROVIDER)
  private readonly redis: IORedis;

  async registry(dto: CreateUserInterface) {
    const hash = await bcrypt.hash(dto.password, this.configService.saltRounds);

    const role = await this.roleService.getRoleByCode(UserRole.User);

    try {
      await this.userRepository.save(
        this.userRepository.create({
          lastName: dto.lastName,
          username: dto.username,
          password: hash,
          role,
          patronymic: dto.patronymic,
          firstName: dto.firstName,
          status: UserStatus.Activated,
        }),
      );
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('User already exists');
      }

      Logger.error(e);

      throw new InternalServerErrorException();
    }
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async remove(uuid: number): Promise<void> {
    await this.userRepository.delete(uuid);
  }

  async add(user: UserEntity): Promise<void> {
    await this.userRepository.saveUser(user);
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOneByUsername(username);
  }

  async getUsersList(dto: IGetUsers) {
    return await this.userRepository.getUsersList(dto);
  }

  async changeUser(dto: IChangeUser, user: UserEntity) {
    const tmp: Partial<UserEntity> = {
      firstName: dto.firstName ? dto.firstName : undefined,
      patronymic: dto.patronymic ? dto.patronymic : undefined,
      lastName: dto.lastName ? dto.lastName : undefined,
      status: dto.status ? dto.status : undefined,
      role: dto.role
        ? await this.roleService.getRoleByCode(dto.role)
        : undefined,
    };

    // Object.keys(tmp).forEach((k) => tmp[k] === undefined && delete tmp[k]);

    await this.userRepository.update({ uuid: dto.uuid }, tmp);

    const log = new LoggerEntity(user.uuid, LogType.ChangeUser, dto.uuid, tmp);
    await this.loggerService.log(log);
  }

  async deleteUser(dto: IDeleteUser, user: UserEntity) {
    await this.userRepository
      .update({ uuid: dto.userUuid }, { status: UserStatus.Deleted })
      .then(async () => {
        const log = new LoggerEntity(
          user.uuid,
          LogType.DeleteUser,
          dto.userUuid,
        );
        await this.loggerService.log(log);

        await this.redis.del(
          this.configService.getUserTokenWhiteList(dto.userUuid),
        );
      });
  }
}
