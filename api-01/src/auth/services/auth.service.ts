import * as bcrypt from 'bcrypt';

import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async loginUser(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userService.findOne(email)

    if (!bcrypt.compareSync(password, user.password))
      throw new ConflictException(`Wrong password (UL-002)`);

    await this.userService.addLoginCount(user);

    delete user.password;

    return user;
  }
}
