import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Req,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { ValidateUserDto } from './dto/validate-user.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CookieOptions, Response, Request } from 'express';
import { IpInfo } from '../common/decorators/get-ip-info.decorator';
import { IpInfo2Interface } from '../common/interfaces/ip-info.interface';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { getAuth, getAuthLogin } from './examples/auth.example';
import { Protect } from './decorators/protect.decorator';
import { ViewInterface } from './interfaces/view.interface';
import { PasswordChangeDto } from './dto/password-change.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { RecoveryDto } from './dto/recovery.dto';

@ApiTags(`auth`)
@Controller('auth')
export class AuthController {
  private sameSite: `lax` | `strict` | `none`;
  private httpOnly: boolean;
  private apiCookieDomain: string;
  private apiCookieExpirationTime: number;

  constructor(private readonly authService: AuthService) {
    this.config();

    this.apiCookieDomain = process.env.API_COOKIE_DOMAIN;
    this.apiCookieExpirationTime = parseInt(
      process.env.API_COOKIE_EXPIRATION_TIME,
    );
  }

  private config() {
    const env = process.env.ENV;
    if (env === `local`) {
      this.sameSite = `none`;
      this.httpOnly = false;
    } else if (env === `dev`) {
      this.sameSite = `strict`;
      this.httpOnly = true;
    } else if (env === `prod`) {
      this.sameSite = `strict`;
      this.httpOnly = true;
    }
  }

  @Post()
  @ApiOperation({ summary: `Create user's token from user password auth` })
  async validateUser(
    @Body() validateUser: ValidateUserDto,
    @Res() response: Response,
    @IpInfo()
    ipInfo: IpInfo2Interface,
  ) {
    const { token, user } = await this.authService.auth(validateUser, ipInfo);

    const cookieOptions: CookieOptions = {
      httpOnly: this.sameSite === `none` ? false : true,
      secure: true,
      sameSite: this.sameSite,
      domain: this.apiCookieDomain,
      maxAge: this.apiCookieExpirationTime,
    };

    response.cookie('token', token, cookieOptions);
    response.statusCode = 200;
    response.send(user);
  }

  @Get()
  @ApiOperation({ summary: `Check user's token` })
  @ApiResponse({
    status: 200,
    schema: {
      example: getAuth,
    },
  })
  async validateToken(@Req() req: Request, @Res() response: Response) {
    if (req.cookies.token) {
      const user = await this.authService.validateToken(req.cookies.token);
      user ? response.send(user) : response.send(null);
      return;
    }
    response.send(null);
  }

  @Delete()
  @ApiOperation({ summary: `Delete user's cookie encrypt token` })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        message: `¡Vuelve pronto!`,
      },
    },
  })
  logout(@Res() response: Response) {
    response.cookie('token', null, {
      domain: process.env.API_COOKIE_DOMAIN,
      expires: new Date(0),
    });
    response.send({ message: '¡Vuelve pronto!' });
  }

  @Get(`login`)
  @ApiOperation({ summary: `Get login info from a user` })
  @ApiResponse({
    status: 200,
    schema: {
      example: getAuthLogin,
    },
  })
  @Protect([ViewInterface.profile])
  findAllLogin(@GetUser() user: User) {
    return this.authService.findAllLogin(user);
  }

  @Post(`verify-email`)
  @ApiOperation({ summary: `Verify email` })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        message: `Email verificado correctamente.`,
      },
    },
  })
  verifyEmail(@Body() body: { token: string }) {
    return this.authService.verifyEmail(body.token);
  }

  @Patch(`password-reset`)
  @ApiOperation({ summary: `Reset a user's password` })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        title: `Contraseña actualizada`,
        message: `Tu contraseña ha sido actualizada exitosamente`,
      },
    },
  })
  resetPassword(@Body() passwordResetDto: PasswordResetDto) {
    return this.authService.resetPassword(passwordResetDto);
  }

  @Post(`recovery`)
  @ApiOperation({ summary: `Recovery email account` })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        title: `Restablecer contraseña`,
        message: `Se envió un enlace de restablecimiento a su email`,
      },
    },
  })
  recovery(@Body() recoveryDto: RecoveryDto) {
    return this.authService.recovery(recoveryDto);
  }

  @Patch(`change-password`)
  @ApiOperation({ summary: `Change a user's password` })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        title: `Contraseña actualizada`,
        message: `Tu contraseña ha sido actualizada exitosamente`,
      },
    },
  })
  @Protect([ViewInterface.profile])
  changePassword(
    @Body() passwordChangeDto: PasswordChangeDto,
    @GetUser() user: User,
  ) {
    return this.authService.changePassword(passwordChangeDto, user);
  }
}
