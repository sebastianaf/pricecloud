import * as bcrypt from 'bcrypt';
import {
  Inject,
  forwardRef,
  Injectable,
  UnauthorizedException,
  GoneException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserService } from '../user/user.service';
import { ValidateUserDto } from './dto/validate-user.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { User } from '../user/entities/user.entity';
import { RoleView } from './entities/role-view.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RoleView)
    private readonly roleViewRepository: Repository<RoleView>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly jwtService: JwtService,
  ) {}

  private generateToken(jwtPayloadDto: JwtPayloadDto) {
    return this.jwtService.sign(jwtPayloadDto);
  }

  async validateToken(token: string) {
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.API_JWT_SECRET);
    } catch (error) {
      throw new UnauthorizedException(`Token no válido (AVT-001)`);
    }

    const decodedData = { id: decoded[`id`], email: decoded[`email`] };
    const { id, email } = decodedData;

    const user = await this.userRepository.findOne({
      where: { id, email },
      select: ['id', 'email', 'password', 'loginCount'],
      relations: [`role`, `role.roleViews`, `role.roleViews.view`],
    });

    if (!user) throw new UnauthorizedException(`Token no válido (AVT-002)`);

    delete user.password;

    return user;
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
        `isEmailVerified`,
      ],
    });

    if (!user)
      throw new UnauthorizedException(
        `El correo electrónico o la contraseña son incorrectos (AVU-001)`,
      );

    const isPassword = bcrypt.compareSync(password, user.password);

    if (!isPassword)
      throw new UnauthorizedException(
        `El correo electrónico o la contraseña son incorrectos (AVU-002)`,
      );

    if (!user.isEmailVerified) {
      await this.userService.sendVerificationEmail(user);
      throw new GoneException(
        `Se ha enviado un nuevo email para verificar su correo (AVU-003)`,
      );
    }

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

  async createTempToken(user: User) {
    return this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: '5m' },
    );
  }
}
