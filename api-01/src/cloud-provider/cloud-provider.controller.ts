import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CloudProviderService } from './cloud-provider.service';
import { CreateCloudProviderDto } from './dto/create-cloud-provider.dto';
import { UpdateCloudProviderDto } from './dto/update-cloud-provider.dto';

@Controller('cloud-provider')
export class CloudProviderController {
  constructor(private readonly cloudProviderService: CloudProviderService) {}

  @Post()
  create(@Body() createCloudProviderDto: CreateCloudProviderDto) {
    return this.cloudProviderService.create(createCloudProviderDto);
  }

  @Get()
  findAll() {
    return this.cloudProviderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cloudProviderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCloudProviderDto: UpdateCloudProviderDto) {
    return this.cloudProviderService.update(+id, updateCloudProviderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cloudProviderService.remove(+id);
  }
}
