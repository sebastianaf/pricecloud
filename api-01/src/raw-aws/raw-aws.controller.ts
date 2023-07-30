import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RawAwsService } from './raw-aws.service';
import { CreateRawAwDto } from './dto/create-raw-aw.dto';
import { UpdateRawAwDto } from './dto/update-raw-aw.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('raw-aws')
@Controller('raw-aws')
export class RawAwsController {
  constructor(private readonly rawAwsService: RawAwsService) {}

  @Post()
  create(@Body() createRawAwDto: CreateRawAwDto) {
    return this.rawAwsService.create(createRawAwDto);
  }

  @Get()
  findAll() {
    return this.rawAwsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rawAwsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRawAwDto: UpdateRawAwDto) {
    return this.rawAwsService.update(+id, updateRawAwDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rawAwsService.remove(+id);
  }
}
