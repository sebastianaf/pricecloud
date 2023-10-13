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
    description: `Verifique su email  para activar su cuenta`,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Protect([ViewInterface.dashboard])
  @ApiOperation({ summary: `Find user` })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post(`send-email`)
  @ApiOperation({ summary: `Send email` })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        message: `Mensaje enviado exitosamente`,
      },
    },
  })
  sendEmail() {
    return this.userService.sendEmail();
  }
}
