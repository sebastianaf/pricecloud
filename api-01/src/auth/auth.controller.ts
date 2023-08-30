import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import { ValidateUserDto } from './dto/validate-user.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(`auth`)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async validateUser(@Body() validateUser: ValidateUserDto) {
    return await this.authService.validateUser(validateUser);
  }
}
