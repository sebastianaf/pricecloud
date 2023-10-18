import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ConflictException,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Protect } from '../auth/decorators/protect.decorator';
import { ViewInterface } from '../auth/interfaces/view.interface';
import { RecoveryDto } from './dto/recovery.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { User } from './entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags(`user`)
@Controller('user')
@ApiResponse({
  schema: {
    example: new ConflictException(`Error message`),
  },
})
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
  @Protect([ViewInterface.dashboard, ViewInterface.profile])
  @ApiOperation({ summary: `Find user` })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post(`verify-email`)
  @ApiOperation({ summary: `Verify email` })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        message: `Email verificado correctamente.`,
      },
    },
  })
  verifyEmail(@Body() body: { token: string }) {
    return this.userService.verifyEmail(body.token);
  }

  @Patch(`password-reset`)
  @ApiOperation({ summary: `Reset a user's password` })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        title: `Contraseña actualizada`,
        message: `Tu contraseña ha sido actualizada exitosamente`,
      },
    },
  })
  resetPassword(@Body() passwordResetDto: PasswordResetDto) {
    return this.userService.resetPassword(passwordResetDto);
  }

  @Post(`recovery`)
  @ApiOperation({ summary: `Recovery email account` })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        title: `Restablecer contraseña`,
        message: `Se envió un enlace de restablecimiento a su email`,
      },
    },
  })
  recovery(@Body() recoveryDto: RecoveryDto) {
    return this.userService.recovery(recoveryDto);
  }

  @Get(`profile`)
  @Protect([ViewInterface.profile])
  @ApiOperation({ summary: `Find user` })
  profile(@GetUser() user: User) {
    return this.userService.profile(user);
  }
}
