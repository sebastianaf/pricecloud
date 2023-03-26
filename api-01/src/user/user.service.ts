import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) throw new ConflictException(`User already exist (UC-001)`);

    createUserDto.password = bcrypt.hashSync(password, 10);

    return await this.userRepository.save(createUserDto);
  }

  private async addLoginCount(user: User) {
    await this.userRepository.update(user.id, {
      loginCount: user.loginCount + 1,
    });
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository
      .createQueryBuilder()
      .addSelect(`password`)
      //.where(`email = :email`, { email })
      .getMany();

    console.log(user);

    if (!user) throw new ConflictException(`User do not exist (UL-001)`);

    console.log(user);

    if (!bcrypt.compareSync(password, user[0].password))
      throw new ConflictException(`Wrong password (UL-002)`);

    this.addLoginCount(user[0]);

    return user;
  }
}
