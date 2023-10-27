import {
  ConflictException,
  Injectable,
  Inject,
  forwardRef,
  Logger,
  GoneException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { EmailService } from '../email/email.service';
import { AuthService } from '../auth/auth.service';
import { CommonService } from '../common/common.service';
import { RoleInterface } from '../auth/interfaces/role.interface';
import paths from '../config/paths';
import { RecoveryDto } from '../auth/dto/recovery.dto';
import { PasswordResetDto } from '../auth/dto/password-reset.dto';
import { IpInfoInterface } from '../common/interfaces/ip-info.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    private readonly emailService: EmailService,
    private readonly commonService: CommonService,
  ) {}

  async findOne(user: User) {
    const user2 = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['role'],
      select: [
        'id',
        'email',
        'firstName',
        'secondName',
        'firstLastName',
        'secondLastName',
        'loginCount',
        'isEmailVerified',
        'role',
        `active`,
        `timezone`,
        'country',
        'language',
      ],
    });

    return user2;
  }

  async findAll() {
    const user = await this.userRepository.find();

    if (user.length === 0)
      throw new ConflictException(`No users registered (USFA-001)`);
    return user;
  }

  async createUser(createUserDto: CreateUserDto, ipInfo: IpInfoInterface) {
    const {
      password,
      email,
      firstLastName,
      firstName,
      secondLastName,
      secondName,
    } = createUserDto;
    const { country, timezone } = ipInfo;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user)
      throw new ConflictException(
        `Por favor intente con un email diferente (USC-001)`,
      );

    const newUser = await this.userRepository.save({
      firstName,
      secondName,
      firstLastName,
      secondLastName,
      email,
      password: bcrypt.hashSync(password, 10),
      role: <any>{ id: RoleInterface.user },
      country: country || null,
      timezone: timezone || null,
    });

    await this.sendVerificationEmail(newUser);

    return {
      id: newUser.id,
      title: `Usuario creado exitosamente`,
      message: `Se ha enviado un correo de verificación a tu email.`,
    };
  }

  async addLoginCount(user: User) {
    await this.userRepository.update(user.id, {
      loginCount: user.loginCount + 1,
    });
  }

  private async createVerificationToken(user: User) {
    const tempToken = await this.authService.createTempToken(user);
    return await this.commonService.encrypt(tempToken);
  }

  async sendVerificationEmail(user: User) {
    const encryptedTempToken = await this.createVerificationToken(user);
    const uriEncodedEncryptedTempToken = encodeURIComponent(encryptedTempToken);

    const url = `https://${process.env.API_COOKIE_DOMAIN}${paths.web.verify}?token=${uriEncodedEncryptedTempToken}`;

    const body = `
      <p>Para verificar tu cuenta, por favor haz click en el siguiente enlace:</p>
      <a href="${url}">Verificar cuenta</a>
    `;

    const subject = `Verificación de cuenta Pricecloud`;

    try {
      await this.emailService.send({ body, subject, to: [user.email] });
    } catch (error) {
      throw new ConflictException(
        `Hubo un error al enviar el email de verificación de correo, por favor intente de nuevo (USSE-001)`,
      );
    }
  }



  async recovery(recoveryDto: RecoveryDto) {
    const { email } = recoveryDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user)
      throw new GoneException(
        `Se envió un enlace de recuperación a su email (USR-001)`,
      );

    await this.sendRecoveryEmail(user);

    return {
      title: `Restablecer contraseña`,
      message: `Se envió un enlace de restablecimiento a su email`,
    };
  }

  async sendRecoveryEmail(user: User) {
    const encryptedTempToken = await this.createVerificationToken(user);
    const uriEncodedEncryptedTempToken = encodeURIComponent(encryptedTempToken);

    const url = `https://${process.env.API_COOKIE_DOMAIN}${paths.web.passwordReset}?token=${uriEncodedEncryptedTempToken}`;

    const body = `
      <p>Para recuperar tu cuenta, por favor haz click en el siguiente enlace:</p>
      <a href="${url}">Recupera tu contraseña</a>
    `;

    const subject = `Recuperación de cuenta Pricecloud`;

    try {
      await this.emailService.send({ body, subject, to: [user.email] });
    } catch (error) {
      throw new ConflictException(
        `Hubo un error al enviar el email de recuperación de cuenta, por favor intente de nuevo (USSRE-001)`,
      );
    }
  }
}
