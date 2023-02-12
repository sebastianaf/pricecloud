import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RawGcpService } from './raw-gcp.service';
import { CreateRawGcpDto } from './dto/create-raw-gcp.dto';
import { UpdateRawGcpDto } from './dto/update-raw-gcp.dto';

@Controller('raw-gcp')
export class RawGcpController {
  constructor(private readonly rawGcpService: RawGcpService) {}

  @Post()
  create(@Body() createRawGcpDto: CreateRawGcpDto) {
    return this.rawGcpService.create(createRawGcpDto);
  }

  @Get()
  findAll() {
    return this.rawGcpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rawGcpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRawGcpDto: UpdateRawGcpDto) {
    return this.rawGcpService.update(+id, updateRawGcpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rawGcpService.remove(+id);
  }
}
