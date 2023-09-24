import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class CookieStrategy extends PassportStrategy(Strategy, 'cookie') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const token = req.cookies['token'];

    const user = await this.validateUser(token);

    if (!user) {
      throw new UnauthorizedException(`Debes autenticarte (CO-001)`);
    }
    return user;
  }

  async validateUser(token: string): Promise<any> {
    const user = await this.authService.validateToken(token);
    return user;
  }
}
