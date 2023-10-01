import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LoggerEntity } from './entity/logger.entity';

@Injectable()
export class LoggerRepository extends Repository<LoggerEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(LoggerEntity, dataSource.createEntityManager());
  }
}
