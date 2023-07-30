import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RawAzureService } from './raw-azure.service';
import { CreateRawAzureDto } from './dto/create-raw-azure.dto';
import { UpdateRawAzureDto } from './dto/update-raw-azure.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('raw-azure')
@Controller('raw-azure')
export class RawAzureController {
  constructor(private readonly rawAzureService: RawAzureService) {}

  @Post()
  create(@Body() createRawAzureDto: CreateRawAzureDto) {
    return this.rawAzureService.create(createRawAzureDto);
  }

  @Get()
  findAll() {
    return this.rawAzureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rawAzureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRawAzureDto: UpdateRawAzureDto) {
    return this.rawAzureService.update(+id, updateRawAzureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rawAzureService.remove(+id);
  }
}
