import {
  Controller,
  Get,
  Post,
  Body,
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
import { CommonService } from '../common/common.service';
import { IpInfo } from '../common/decorators/get-ip-info.decorator';
import { IpInfoInterface } from '../common/interfaces/ip-info.interface';
import { PasswordChangeDto } from '../auth/dto/password-change.dto';

@ApiTags(`user`)
@Controller('user')
@ApiResponse({
  schema: {
    example: new ConflictException(`Error message`),
  },
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly commonService: CommonService,
  ) {}

  @Post()
  @ApiOperation({ summary: `Create users` })
  @ApiResponse({
    status: 200,
    description: `Se ha enviado un correo de verificación a tu email.`,
  })
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @IpInfo() ipInfo: IpInfoInterface,
  ) {
    return this.userService.createUser(createUserDto, ipInfo);
  }

  @Get()
  @Protect([ViewInterface.dashboard, ViewInterface.profile])
  @ApiOperation({ summary: `Find user` })
  findOne(@GetUser() user: User) {
    return this.userService.findOne(user);
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
}
