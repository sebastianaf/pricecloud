import { Injectable } from '@nestjs/common';
import { Log } from './entities/log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogTypeInterface } from './interfaces/log-type.interface';
import { User } from '../user/entities/user.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  async create({
    logType,
    message,
    stack,
    user,
  }: {
    logType: LogTypeInterface;
    message: string;
    stack?: Object;
    user?: User;
  }) {
    return await this.logRepository.save({ logType, message, stack, user });
  }
}
