import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../user/entities/user.entity';
import { userSeed } from './data/user';

@Injectable()
export class SeedService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.seedUser();
  }

  async seedUser() {
    const user = await this.userRepository.findOne({
      where: { email: userSeed[0].email },
    });
    for (let i = 0; i < userSeed.length; i++) {
      if (user) {
        this.logger.verbose('Init user already created', `SeedModule`);
        break;
      }
      userSeed[i].password = bcrypt.hashSync(userSeed[i].password, 10);
      await this.userRepository.save(userSeed[i]);
      this.logger.log('Seeding users... Done', `SeedModule`);
    }
  }
}
