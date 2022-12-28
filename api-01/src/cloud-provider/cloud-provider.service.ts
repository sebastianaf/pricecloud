import { Injectable } from '@nestjs/common';
import { CreateCloudProviderDto } from './dto/create-cloud-provider.dto';
import { UpdateCloudProviderDto } from './dto/update-cloud-provider.dto';

@Injectable()
export class CloudProviderService {
  create(createCloudProviderDto: CreateCloudProviderDto) {
    return 'This action adds a new cloudProvider';
  }

  findAll() {
    return `This action returns all cloudProvider`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cloudProvider`;
  }

  update(id: number, updateCloudProviderDto: UpdateCloudProviderDto) {
    return `This action updates a #${id} cloudProvider`;
  }

  remove(id: number) {
    return `This action removes a #${id} cloudProvider`;
  }
}
