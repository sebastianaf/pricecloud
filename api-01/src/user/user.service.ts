import {
  ConflictException,
  Injectable,
  Inject,
  forwardRef,
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

  async createUser(createUserDto: CreateUserDto) {
    const {
      password,
      email,
      firstLastName,
      firstName,
      secondLastName,
      secondName,
    } = createUserDto;

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
    });

    await this.sendVerificationEmail(newUser);

    return {
      id: newUser.id,
      title: `Verificación de email`,
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

  private async sendVerificationEmail(user: User) {
    const encryptedTempToken = await this.createVerificationToken(user);
    const uriDecodedEncryptedTempToken = encodeURIComponent(encryptedTempToken);

    const url = `https://${process.env.API_COOKIE_DOMAIN}/${paths.user.emailVerify}?token=${uriDecodedEncryptedTempToken}`;

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

  async verifyEmail(uriEncodedEncryptedTempToken: string) {
    const encryptedTempToken = decodeURIComponent(uriEncodedEncryptedTempToken);

    const tempToken = await this.commonService.decrypt(encryptedTempToken);

    const user = await this.authService.validateToken(tempToken);

    await this.userRepository.update(user.id, { isEmailVerified: true });

    return { message: `Email verificado exitosamente` };
  }
}
