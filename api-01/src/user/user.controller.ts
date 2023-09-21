import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IsPublic } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags(`Users`)
@Controller('user')
@ApiBearerAuth()
//@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Post('testing')
  @UseInterceptors(FileInterceptor('imageFile'))
  confirmRequestChange(@UploadedFile() file) {
    // Información del archivo:
    //console.log(file.originalname);
    console.log(file);

    return { message: `Recibido correctamente` };
  }
}
