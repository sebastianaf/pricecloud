import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Protect } from '../auth/decorators/protect.decorator';
import { ViewInterface } from '../auth/interfaces/view.interface';

@ApiTags(`Users`)
@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: `Create users` })
  @ApiResponse({
    status: 200,
    description: `Se ha enviado un correo de verificación a tu email.`,
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @Protect([ViewInterface.dashboard])
  @ApiOperation({ summary: `Find user` })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post(`verify-email`)
  @ApiOperation({ summary: `Verify email` })
  @ApiResponse({
    status: 200,
    description: `Email verificado correctamente.`,
  })
  verifyEmail(@Body() body: { token: string }) {
    return this.userService.verifyEmail(body.token);
  }
}
