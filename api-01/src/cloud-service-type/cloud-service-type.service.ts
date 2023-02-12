import { Injectable } from '@nestjs/common';
import { CreateCloudServiceTypeDto } from './dto/create-cloud-service-type.dto';
import { UpdateCloudServiceTypeDto } from './dto/update-cloud-service-type.dto';

@Injectable()
export class CloudServiceTypeService {
  create(createCloudServiceTypeDto: CreateCloudServiceTypeDto) {
    return 'This action adds a new cloudServiceType';
  }

  findAll() {
    return `This action returns all cloudServiceType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cloudServiceType`;
  }

  update(id: number, updateCloudServiceTypeDto: UpdateCloudServiceTypeDto) {
    return `This action updates a #${id} cloudServiceType`;
  }

  remove(id: number) {
    return `This action removes a #${id} cloudServiceType`;
  }
}
