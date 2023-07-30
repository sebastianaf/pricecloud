import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CloudServiceService } from './cloud-service.service';
import { CreateCloudServiceDto } from './dto/create-cloud-service.dto';
import { UpdateCloudServiceDto } from './dto/update-cloud-service.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cloud-service')
@Controller('cloud-service')
export class CloudServiceController {
  constructor(private readonly cloudServiceService: CloudServiceService) {}

  @Post()
  create(@Body() createCloudServiceDto: CreateCloudServiceDto) {
    return this.cloudServiceService.create(createCloudServiceDto);
  }

  @Get()
  findAll() {
    return this.cloudServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cloudServiceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCloudServiceDto: UpdateCloudServiceDto) {
    return this.cloudServiceService.update(+id, updateCloudServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cloudServiceService.remove(+id);
  }
}
