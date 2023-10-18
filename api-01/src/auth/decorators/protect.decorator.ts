// required-role.decorator.ts
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { CookieAuthGuard } from '../guards/cookie-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export const Protect = (views?: number[]) => {
  return applyDecorators(
    SetMetadata('views', views),
    UseGuards(CookieAuthGuard),
    ApiBearerAuth(),
  );
};
