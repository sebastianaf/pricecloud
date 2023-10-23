import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Req,
  Delete,
  Put,
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
import { defaultAuthStatus } from './interfaces/auth-status-type.interface';
import { Protect } from './decorators/protect.decorator';
import { ViewInterface } from './interfaces/view.interface';
import { UpdateAuthStatusDto } from './dto/update-auth-status.dto';

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

  @Get(`status`)
  @ApiOperation({ summary: `Get user's setting's status` })
  @ApiResponse({
    status: 200,
    schema: {
      example: defaultAuthStatus,
    },
  })
  @Protect([ViewInterface.profile])
  findOneStatus(@GetUser() user: User) {
    return this.authService.findOneStatus(user);
  }

  @Put(`status`)
  @ApiOperation({ summary: `Update user's auth status` })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        message: `Configuración aplicada exitosamente`,
      },
    },
  })
  @Protect([ViewInterface.profile])
  update(
    @Body() updateAuthStatusDto: UpdateAuthStatusDto,
    @GetUser() user: User,
  ) {
    return this.authService.updateStatus(updateAuthStatusDto, user);
  }
}
