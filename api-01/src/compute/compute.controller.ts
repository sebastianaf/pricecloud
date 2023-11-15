import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ComputeService } from './compute.service';
import { Protect } from '../auth/decorators/protect.decorator';
import { ViewInterface } from '../auth/interfaces/view.interface';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('compute')
export class ComputeController {
  constructor(private readonly computeService: ComputeService) {}

  @Get(`locations`)
  @Protect([ViewInterface.deployAws])
  findAllLocations(@GetUser() user: User) {
    return this.computeService.findAllLocations(user);
  }
}
