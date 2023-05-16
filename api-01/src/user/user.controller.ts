import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';

@ApiTags(`Users`)
@Controller('user')
//@UseGuards(ApiKeyGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: `Create users` })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /* @Post(`login`)
  @ApiOperation({ summary: `Login users` })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  } */
}
