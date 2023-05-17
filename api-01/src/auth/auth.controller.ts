import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidateUserDto } from './dto/validate-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post(`login`)
  async validateUser(@Body() validateUser: ValidateUserDto) {
    return await this.authService.validateUser(validateUser);
  }
}
