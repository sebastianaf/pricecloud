import { Body, Controller, Get, Post } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ViewInterface } from '../auth/interfaces/view.interface';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { Protect } from '../auth/decorators/protect.decorator';
import { CreateStorageDto } from './dto/create-storage.dto';

@Controller('storage')
@ApiTags(`storage`)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  @ApiOperation({ summary: `Get all aws buckets` })
  @Protect([ViewInterface.deployAws])
  findAllnodes(@GetUser() user: User) {
    return this.storageService.findAllContainers(user);
  }

  @Post()
  @ApiOperation({ summary: `Create aws bucket` })
  @Protect([ViewInterface.deployAws])
  createBucket(
    @GetUser() user: User,
    @Body() createStorageDto: CreateStorageDto,
  ) {
    return this.storageService.createBucket(user, createStorageDto);
  }
}
