import { Injectable } from '@nestjs/common';
import { CreateCloudServiceSkuDto } from './dto/create-cloud-service-sku.dto';
import { UpdateCloudServiceSkuDto } from './dto/update-cloud-service-sku.dto';

@Injectable()
export class CloudServiceSkuService {
  create(createCloudServiceSkuDto: CreateCloudServiceSkuDto) {
    return 'This action adds a new cloudServiceSku';
  }

  findAll() {
    return `This action returns all cloudServiceSku`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cloudServiceSku`;
  }

  update(id: number, updateCloudServiceSkuDto: UpdateCloudServiceSkuDto) {
    return `This action updates a #${id} cloudServiceSku`;
  }

  remove(id: number) {
    return `This action removes a #${id} cloudServiceSku`;
  }
}
