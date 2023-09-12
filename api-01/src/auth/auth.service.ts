import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { ValidateUserDto } from './dto/validate-user.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken(jwtPayloadDto: JwtPayloadDto) {
    return this.jwtService.sign(jwtPayloadDto);
  }

  async validateUser(validateUserDTO: ValidateUserDto) {
    const { password, email } = validateUserDTO;

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'loginCount'],
    });

    if (!user)
      throw new ConflictException(
        `El correo electrónico o la contraseña son incorrectos (AVU-001)`,
      );

    if (!bcrypt.compareSync(password, user.password)) return null;

    await this.userService.addLoginCount(user);
    delete user.password;

    const token = this.generateToken({ id: user.id, email: user.email });

    return { token, user };
  }
}
