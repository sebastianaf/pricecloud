import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';

import { UserService } from '../user/user.service';
import { ValidateUserDto } from './dto/validate-user.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { RoleView } from './entities/role-view.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RoleView)
    private readonly roleViewRepository: Repository<RoleView>,

    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken(jwtPayloadDto: JwtPayloadDto) {
    return this.jwtService.sign(jwtPayloadDto);
  }

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.API_JWT_SECRET);

      const decodedData = { id: decoded[`id`], email: decoded[`email`] };
      const { id, email } = decodedData;

      const user = await this.userRepository.findOne({
        where: { id, email },
        select: ['id', 'email', 'password', 'loginCount'],
        relations: [`role`, `role.roleViews`, `role.roleViews.view`],
      });

      delete user.password;

      if (!user) throw new UnauthorizedException(`Token no válido (AVT-001)`);

      return user;
    } catch (error) {
      return null;
    }
  }

  async auth(validateUserDTO: ValidateUserDto) {
    const { password, email } = validateUserDTO;

    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        `id`,
        `email`,
        `firstName`,
        `secondName`,
        `firstLastName`,
        `secondLastName`,
        `password`,
        `loginCount`,
      ],
    });

    const isPassword = bcrypt.compareSync(password, user.password);

    if (!user || !isPassword)
      throw new UnauthorizedException(
        `El correo electrónico o la contraseña son incorrectos (AVU-001)`,
      );

    await this.userService.addLoginCount(user);
    delete user.password;

    const token = this.generateToken({ id: user.id, email: user.email });

    return { token, user };
  }

  async getRoleViews(roleId: number) {
    return await this.roleViewRepository.findOne({
      where: { role: { id: roleId } as any },
    });
  }
}
