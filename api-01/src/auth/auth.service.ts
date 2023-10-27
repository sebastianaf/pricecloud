import * as bcrypt from 'bcrypt';
import {
  Inject,
  forwardRef,
  Injectable,
  UnauthorizedException,
  GoneException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
moment.locale('es');

import { UserService } from '../user/user.service';
import { ValidateUserDto } from './dto/validate-user.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { User } from '../user/entities/user.entity';
import { RoleView } from './entities/role-view.entity';
import { CommonService } from '../common/common.service';
import { Login } from './entities/login.entity';
import { LoginEventInterface } from './interfaces/login-event.interface';
import { IpInfo2Interface } from '../common/interfaces/ip-info.interface';
import {
  AuthStatusInterface,
  AuthStatusTypeInterface,
  defaultAuthStatus,
} from './interfaces/auth-status-type.interface';
import { AuthStatus } from './entities/auth-status.entity';
import { UpdateAuthStatusDto } from './dto/update-auth-status.dto';
import { ChangePasswordDto } from './dto/check-password.dto';
import { PasswordChangeDto } from './dto/password-change.dto';
import { PasswordResetDto } from './dto/password-reset.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RoleView)
    private readonly roleViewRepository: Repository<RoleView>,
    @InjectRepository(Login)
    private readonly loginRepository: Repository<Login>,
    @InjectRepository(AuthStatus)
    private readonly authStatusRepository: Repository<AuthStatus>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly jwtService: JwtService,
    private readonly commonService: CommonService,
  ) {}

  private generateToken(jwtPayloadDto: JwtPayloadDto) {
    return this.jwtService.sign(jwtPayloadDto);
  }

  async validateToken(token: string, isEncrypted = true) {
    let decoded: any;
    try {
      if (isEncrypted) token = await this.commonService.decrypt(token);

      decoded = jwt.verify(token, process.env.API_JWT_SECRET);
    } catch (error) {
      return null;
    }

    const decodedData = { id: decoded[`id`] };
    const { id } = decodedData;

    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'password', 'loginCount', 'isEmailVerified'],
      relations: [`role`, `role.roleViews`, `role.roleViews.view`],
    });

    if (!user) throw new UnauthorizedException(`Token no válido (AVT-002)`);

    delete user.password;

    return user;
  }

  async auth(validateUserDTO: ValidateUserDto, ipInfo: IpInfo2Interface) {
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

    await this.createLogin(ipInfo, user);

    let token = this.generateToken({ id: user.id });

    token = await this.commonService.encrypt(token);

    delete user.password;
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

  async createLogin(ipInfo: IpInfo2Interface, user: User) {
    await this.userService.addLoginCount(user);

    const { country, timezone, ip, city } = ipInfo.ipInfo;

    await this.loginRepository.save({
      event: LoginEventInterface.login,
      user,
      ip: ip || null,
      location: `${`${city} ` || ``}${country || ``}`.trim() || null,
      timezone: timezone || null,
      userAgent: ipInfo.userAgent || null,
    });
  }

  async findAllLogin(user: User) {
    const logins = await this.loginRepository.find({
      where: { user: <any>{ id: user.id } },
      order: { createdAt: `DESC` },
    });

    return logins.map((login) => {
      const login2 = {
        ...login,
        createdAt: moment((login?.createdAt).toISOString()).fromNow(),
      };
      return login2;
    });
  }

  async findOneStatus(user: User): Promise<AuthStatusInterface> {
    const authStatuses = await this.authStatusRepository.find({
      where: { user: <any>{ id: user.id } },
    });

    const authStatus: AuthStatusInterface = defaultAuthStatus;

    authStatuses.forEach((setting) => {
      authStatus[setting.authStatusType] = setting.active;
    });

    return authStatus;
  }

  async updateStatus(updateAuthStatusDto: UpdateAuthStatusDto, user: User) {
    const { authStatusType, active } = updateAuthStatusDto;

    const existingAuthStatus = await this.authStatusRepository.findOne({
      where: { user: <any>{ id: user.id }, authStatusType },
    });

    if (existingAuthStatus) {
      existingAuthStatus.active = active;
      await this.authStatusRepository.save(existingAuthStatus);
    } else {
      await this.authStatusRepository.save({
        authStatusType,
        active,
        user,
      });
    }

    return {
      message: `Configuración aplicada exitosamente`,
    };
  }

  async verifyEmail(uriEncodedEncryptedTempToken: string) {
    const encryptedTempToken = decodeURIComponent(uriEncodedEncryptedTempToken);

    const user = await this.validateToken(encryptedTempToken);

    if (!user)
      throw new ConflictException(`Error al verificar el email (USVE-001)`);

    if (user.isEmailVerified)
      throw new ConflictException(
        `El email ya se encuentra verificado (USVE-002)`,
      );

    await this.userRepository.update(user.id, { isEmailVerified: true });

    return { message: `Email verificado exitosamente` };
  }

  async resetPassword(passwordResetDto: PasswordResetDto) {
    const { password, token } = passwordResetDto;

    const uriEncodedEncryptedTempToken = token;

    const encryptedTempToken = decodeURIComponent(uriEncodedEncryptedTempToken);

    const user = await this.validateToken(encryptedTempToken);

    if (!user)
      throw new ConflictException(
        `Error al restablecer la contraseña (USRP-001)`,
      );

    await this.userRepository.update(user.id, {
      password: bcrypt.hashSync(password, 10),
    });

    return {
      title: `Contraseña actualizada`,
      message: `Tu contraseña ha sido actualizada exitosamente`,
    };
  }

  async checkPassword(changePasswordDto: ChangePasswordDto) {
    const { password, user } = changePasswordDto;

    const isPassword = bcrypt.compareSync(password, user.password);

    if (!isPassword)
      throw new UnauthorizedException(`La contraseña es incorrecta (ACKP-001)`);
  }

  async changePassword(passwordChangeDto: PasswordChangeDto, user: User) {
    const { oldPassword, newPassword } = passwordChangeDto;

    const user2 = await this.userRepository.findOne({
      select: [`id`, `password`],
      where: { id: user.id },
    });

    if (!user2)
      throw new ConflictException(
        `Error al restablecer la contraseña (ACGP-001)`,
      );

    await this.checkPassword({
      password: oldPassword,
      user: user2,
    });

    user2.password = bcrypt.hashSync(newPassword, 10);
    await this.userRepository.save(user2);

    return {
      title: `Contraseña actualizada`,
      message: `Tu contraseña ha sido actualizada exitosamente`,
    };
  }
}
