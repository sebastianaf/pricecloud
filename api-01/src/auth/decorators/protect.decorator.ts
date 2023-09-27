// required-role.decorator.ts
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { CookieAuthGuard } from '../guards/cookie-auth.guard';

export const Protect = (pages?: number[]) => {
  return applyDecorators(
    SetMetadata('pages', pages),
    UseGuards(CookieAuthGuard),
  );
};
