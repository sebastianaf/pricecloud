import { Controller, Post, UseGuards, Body, Get, Res } from '@nestjs/common';
import { ValidateUserDto } from './dto/validate-user.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags(`auth`)
@Controller('auth')
export class AuthController {
  private sameSite: `lax` | `strict` | `none`;
  private httpOnly: boolean;

  constructor(private readonly authService: AuthService) {
    this.config();
  }

  private config() {
    const env = process.env.ENV;
    if (env === `local`) {
      this.sameSite = `none`;
      this.httpOnly = false;
    } else if (env === `dev`) {
      this.sameSite = `strict`;
      this.httpOnly = false;
    } else if (env === `prod`) {
      this.sameSite = `strict`;
      this.httpOnly = false;
    }
  }

  @Post()
  async validateUser(
    @Body() validateUser: ValidateUserDto,
    @Res() response: Response,
  ) {
    const authData = await this.authService.auth(validateUser);

    const cookieOptions = {
      httpOnly: this.sameSite === `none` ? false : true,
      secure: true,
      sameSite: this.sameSite,
      domain: process.env.API_COOKIE_DOMAIN,
      maxAge: Number(process.env.API_COOKIE_EXPIRATION_TIME),
    };

    if (authData) {
      response.cookie('token', authData.token, cookieOptions);
    }
    response.send(authData.user);
  }
}
