import { Module } from '@nestjs/common';
import { CloudServiceTypeService } from './cloud-service-type.service';
import { CloudServiceTypeController } from './cloud-service-type.controller';

@Module({
  controllers: [CloudServiceTypeController],
  providers: [CloudServiceTypeService]
})
export class CloudServiceTypeModule {}
