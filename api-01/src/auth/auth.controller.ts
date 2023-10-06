import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Res,
  ConflictException,
  UnauthorizedException,
  Req,
  Delete,
} from '@nestjs/common';
import { ValidateUserDto } from './dto/validate-user.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CookieOptions, Response, Request } from 'express';

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
      this.httpOnly = true;
    } else if (env === `prod`) {
      this.sameSite = `strict`;
      this.httpOnly = true;
    }
  }

  @Post()
  async validateUser(
    @Body() validateUser: ValidateUserDto,
    @Res() response: Response,
  ) {
    const { token, user } = await this.authService.auth(validateUser);

    const cookieOptions = {
      httpOnly: this.sameSite === `none` ? false : true,
      secure: true,
      sameSite: this.sameSite,
      domain: process.env.API_COOKIE_DOMAIN,
      maxAge: 15000,
    };

    response.cookie('token', token, cookieOptions);
    response.statusCode = 200;
    response.send(user);
  }

  @Get()
  async validateToken(@Req() req: Request, @Res() response: Response) {
    const authData = await this.authService.validateToken(req.cookies.token);

    if (!authData)
      throw new UnauthorizedException(`Por favor inicia sesión (AVT-001)`);

    response.send(authData);
  }

  @Delete()
  logout(@Res() response: Response) {
    response.cookie('token', null, {
      domain: process.env.API_COOKIE_DOMAIN,
      expires: new Date(0),
    });
    response.send({ message: 'Vuelve pronto !' });
  }
}
