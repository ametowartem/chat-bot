import { Module } from '@nestjs/common';
import { LoggerService } from './service/logger.service';
import { LoggerRepository } from './logger.repository';

@Module({
  providers: [LoggerService, LoggerRepository],
  exports: [LoggerService],
})
export class LoggerModule {}
