import { Injectable } from '@nestjs/common';
import { CreateCloudServiceDto } from './dto/create-cloud-service.dto';
import { UpdateCloudServiceDto } from './dto/update-cloud-service.dto';

@Injectable()
export class CloudServiceService {
  create(createCloudServiceDto: CreateCloudServiceDto) {
    return 'This action adds a new cloudService';
  }

  findAll() {
    return `This action returns all cloudService`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cloudService`;
  }

  update(id: number, updateCloudServiceDto: UpdateCloudServiceDto) {
    return `This action updates a #${id} cloudService`;
  }

  remove(id: number) {
    return `This action removes a #${id} cloudService`;
  }
}
