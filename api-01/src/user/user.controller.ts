import {
  Controller,
  Get,
  Post,
  Body,
  ConflictException,
  Patch,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Protect } from '../auth/decorators/protect.decorator';
import { ViewInterface } from '../auth/interfaces/view.interface';
import { User } from './entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { IpInfo } from '../common/decorators/get-ip-info.decorator';
import { IpInfoInterface } from '../common/interfaces/ip-info.interface';
import { SettingsInterface } from './interfaces/settings.interface';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';
import { credentialsResponseDefault } from './interfaces/credentials.interface';
import { HttpStatusCode } from 'axios';

@ApiTags(`user`)
@Controller('user')
@ApiResponse({
  schema: {
    example: new ConflictException(`Error message`),
  },
  status: HttpStatusCode.Conflict,
})
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Get(`settings`)
  @Protect([ViewInterface.profile])
  @ApiOperation({ summary: `Find user settings object` })
  findOneSettings(@GetUser() user: User) {
    return this.userService.findOneSettings(user);
  }

  @Put(`settings`)
  @Protect([ViewInterface.profile])
  @ApiOperation({ summary: `Update user settings object` })
  updateOneSettings(
    @Body() updateSettingsDto: UpdateSettingsDto,
    @GetUser() user: User,
  ) {
    return this.userService.updateOneSettings(user, updateSettingsDto);
  }

  @Get(`credentials`)
  @Protect([ViewInterface.providerSettings])
  @ApiOperation({ summary: `Find user credentials object` })
  @ApiResponse({
    status: HttpStatusCode.Ok,
    schema: {
      example: credentialsResponseDefault,
    },
  })
  findOneCredentialsResponse(@GetUser() user: User) {
    return this.userService.findOneCredentialsResponse(user);
  }

  @Put(`credentials`)
  @Protect([ViewInterface.providerSettings])
  @ApiOperation({ summary: `Update user credentials object` })
  @ApiResponse({
    status: HttpStatusCode.Created,
    schema: {
      example: {
        message: `Credenciales actualizadas.`,
      },
    },
  })
  updateOneCredentials(
    @Body() updateCredentialsDto: UpdateCredentialsDto,
    @GetUser() user: User,
  ) {
    return this.userService.updateOneCredentials(user, updateCredentialsDto);
  }

  @Get(`/management`)
  @Protect([ViewInterface.managementUsers])
  @ApiOperation({ summary: `Users data` })
  @ApiResponse({
    status: HttpStatusCode.Created,
    schema: {
      example: {
        message: `Credenciales actualizadas.`,
      },
    },
  })
  findAllUsers() {
    return this.userService.findAllUsers();
  }
}
