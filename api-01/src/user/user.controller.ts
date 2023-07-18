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
import { AuthGuard } from '@nestjs/passport';

@ApiTags(`Users`)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@UseGuards(AuthGuard(`jwt`))
  @Post()
  @ApiOperation({ summary: `Create users` })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: `Find user` })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: `Find all users` })
  findAll() {
    return this.userService.findAll();
  }

  /* @Post(`login`)
  @ApiOperation({ summary: `Login users` })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  } */
}
