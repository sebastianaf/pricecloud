import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

@Injectable()
export class CookieAuthGuard extends AuthGuard('cookie') {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.token;

    if (!token)
      throw new UnauthorizedException(`Por favor inicie sesión (AVT-001)`);

    const validateTokenData = await this.authService.validateToken(token);

    console.log(validateTokenData.user);

    const roleView = await this.authService.getRoleViews(
      validateTokenData.user.role.id,
    );

    console.log(roleView);

    /* if (!pages.some((page) => user.pages.includes(page))) {
      throw new UnauthorizedException(
        'No tienes acceso a esta página (CG-002)',
      );
    } */

    const hasProtectDecorator = this.reflector.get<number[]>(
      'pages',
      context.getHandler(),
    );

    if (!hasProtectDecorator) {
      return true;
    }
    return false;
  }
}
