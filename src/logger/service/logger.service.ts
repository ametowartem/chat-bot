import { Injectable } from '@nestjs/common';
import { LoggerEntity } from '../entity/logger.entity';
import { LoggerRepository } from '../logger.repository';

@Injectable()
export class LoggerService {
  constructor(private readonly loggerRepository: LoggerRepository) {}

  async log(log: LoggerEntity) {
    await this.loggerRepository.insert(log);
  }
}
