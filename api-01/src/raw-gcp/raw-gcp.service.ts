import { Injectable } from '@nestjs/common';
import { CreateRawGcpDto } from './dto/create-raw-gcp.dto';
import { UpdateRawGcpDto } from './dto/update-raw-gcp.dto';

@Injectable()
export class RawGcpService {
  create(createRawGcpDto: CreateRawGcpDto) {
    return 'This action adds a new rawGcp';
  }

  findAll() {
    return `This action returns all rawGcp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rawGcp`;
  }

  update(id: number, updateRawGcpDto: UpdateRawGcpDto) {
    return `This action updates a #${id} rawGcp`;
  }

  remove(id: number) {
    return `This action removes a #${id} rawGcp`;
  }
}
