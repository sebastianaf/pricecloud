import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CloudServiceSkuService } from './cloud-service-sku.service';
import { CreateCloudServiceSkuDto } from './dto/create-cloud-service-sku.dto';
import { UpdateCloudServiceSkuDto } from './dto/update-cloud-service-sku.dto';

@Controller('cloud-service-sku')
export class CloudServiceSkuController {
  constructor(private readonly cloudServiceSkuService: CloudServiceSkuService) {}

  @Post()
  create(@Body() createCloudServiceSkuDto: CreateCloudServiceSkuDto) {
    return this.cloudServiceSkuService.create(createCloudServiceSkuDto);
  }

  @Get()
  findAll() {
    return this.cloudServiceSkuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cloudServiceSkuService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCloudServiceSkuDto: UpdateCloudServiceSkuDto) {
    return this.cloudServiceSkuService.update(+id, updateCloudServiceSkuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cloudServiceSkuService.remove(+id);
  }
}
