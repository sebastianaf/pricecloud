import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CookieAuthGuard extends AuthGuard('cookie') {
  handleRequest(err, user, info: Error) {
    if (err || info || !user) {
      throw err || new UnauthorizedException(info.message);
    }
    return user;
  }
}
