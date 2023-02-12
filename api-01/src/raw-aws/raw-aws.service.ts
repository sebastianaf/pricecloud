import { Injectable } from '@nestjs/common';
import { CreateRawAwDto } from './dto/create-raw-aw.dto';
import { UpdateRawAwDto } from './dto/update-raw-aw.dto';

@Injectable()
export class RawAwsService {
  create(createRawAwDto: CreateRawAwDto) {
    return 'This action adds a new rawAw';
  }

  findAll() {
    return `This action returns all rawAws`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rawAw`;
  }

  update(id: number, updateRawAwDto: UpdateRawAwDto) {
    return `This action updates a #${id} rawAw`;
  }

  remove(id: number) {
    return `This action removes a #${id} rawAw`;
  }
}
