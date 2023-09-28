import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
  ForbiddenException,
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

    const user = await this.authService.validateToken(token);
    console.log(user.role.roleViews);

    const requiredViews = this.reflector.get<number[]>(
      'views',
      context.getHandler(),
    );

    if (!requiredViews) {
      return true;
    } else {
      if (requiredViews.length === 0) return true;
    }

    const hasAccess = requiredViews.some((viewId) =>
      user.role.roleViews.map((roleView) => roleView.view.id).includes(viewId),
    );

    if (!hasAccess) {
      throw new ForbiddenException(`No tiene acceso a este recurso (AVT-002)`);
    }

    return true;
  }
}