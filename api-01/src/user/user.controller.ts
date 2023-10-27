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
import { User } from './entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { IpInfo } from '../common/decorators/get-ip-info.decorator';
import { IpInfoInterface } from '../common/interfaces/ip-info.interface';

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
}
