import { Injectable } from '@nestjs/common';
import { CreateRawAzureDto } from './dto/create-raw-azure.dto';
import { UpdateRawAzureDto } from './dto/update-raw-azure.dto';

@Injectable()
export class RawAzureService {
  create(createRawAzureDto: CreateRawAzureDto) {
    return 'This action adds a new rawAzure';
  }

  findAll() {
    return `This action returns all rawAzure`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rawAzure`;
  }

  update(id: number, updateRawAzureDto: UpdateRawAzureDto) {
    return `This action updates a #${id} rawAzure`;
  }

  remove(id: number) {
    return `This action removes a #${id} rawAzure`;
  }
}
