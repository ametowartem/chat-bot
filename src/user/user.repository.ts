import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { IGetUsers } from './interface/get-users.interface';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findOneByUsername(username: string) {
    return await this.createQueryBuilder('users')
      .where({ username })
      .leftJoinAndSelect('users.role', 'roles')
      .getOne();
  }

  async saveUser(user: UserEntity) {
    try {
      const savedUser = await this.save(user);
      console.log('Новый пользователь сохранен:', savedUser);
    } catch (error) {
      console.error('Ошибка при сохранении пользователя:', error);
    }
  }

  async getUsersList(dto: IGetUsers) {
    const page = dto.pagination?.page ?? 1;
    const limit = dto.pagination?.limit ?? 100;

    const qb = this.createQueryBuilder('users')
      .innerJoinAndSelect('users.role', 'roles')
      .take(limit)
      .skip((page - 1) * limit);

    if (dto.filters?.search) {
      qb.andWhere(
        `CONCAT(first_name, ' ', patronymic, ' ', last_name) ILIKE :search`,
        { search: dto.filters.search },
      );
    }

    if (dto.filters?.userUuids?.length) {
      qb.andWhere(`uuid = (:...userUuids)`, {
        userUuids: dto.filters.userUuids,
      });
    }

    if (dto.filters?.statuses?.length) {
      qb.andWhere(`status in (:...statuses)`, {
        statuses: dto.filters.statuses,
      });
    }

    if (dto.sorting?.field) {
      qb.orderBy(dto.sorting.field, dto.sorting.direction || 'ASC');
    }

    return await qb.getMany();
  }
}
