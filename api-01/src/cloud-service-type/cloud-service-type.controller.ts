import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CloudServiceTypeService } from './cloud-service-type.service';
import { CreateCloudServiceTypeDto } from './dto/create-cloud-service-type.dto';
import { UpdateCloudServiceTypeDto } from './dto/update-cloud-service-type.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cloud-service-type')
@Controller('cloud-service-type')
export class CloudServiceTypeController {
  constructor(private readonly cloudServiceTypeService: CloudServiceTypeService) {}

  @Post()
  create(@Body() createCloudServiceTypeDto: CreateCloudServiceTypeDto) {
    return this.cloudServiceTypeService.create(createCloudServiceTypeDto);
  }

  @Get()
  findAll() {
    return this.cloudServiceTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cloudServiceTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCloudServiceTypeDto: UpdateCloudServiceTypeDto) {
    return this.cloudServiceTypeService.update(+id, updateCloudServiceTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cloudServiceTypeService.remove(+id);
  }
}
