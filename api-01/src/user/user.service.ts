import { ConflictException, Injectable } from '@nestjs/common';
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

  async findOne(email: string) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password', 'loginCount'],
      where: { email },
    });

    if (!user) throw new ConflictException(`User do not exist (UL-001)`);
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user)
      throw new ConflictException(`The user take is not available (UC-001)`);

    createUserDto.password = bcrypt.hashSync(password, 10);

    return await this.userRepository.save(createUserDto);
  }

  async addLoginCount(user: User) {
    await this.userRepository.update(user.id, {
      loginCount: user.loginCount + 1,
    });
  }
}
