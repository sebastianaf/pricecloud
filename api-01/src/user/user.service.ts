import { ConflictException, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new ConflictException(`User do not exist (USFO-001)`);
    return user;
  }

  async findAll() {
    const user = await this.userRepository.find();

    if (user.length === 0)
      throw new ConflictException(`No users registered (USFA-001)`);
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) throw new ConflictException(`User not available (USC-001)`);

    createUserDto.password = bcrypt.hashSync(password, 10);

    return { id: (await this.userRepository.save(createUserDto)).id };
  }

  async addLoginCount(user: User) {
    await this.userRepository.update(user.id, {
      loginCount: user.loginCount + 1,
    });
  }
}
