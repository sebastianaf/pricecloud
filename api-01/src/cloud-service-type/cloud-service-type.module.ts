import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudServiceTypeService } from './cloud-service-type.service';
import { CloudServiceTypeController } from './cloud-service-type.controller';
import { CloudServiceType } from './entities/cloud-service-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CloudServiceType])],
  controllers: [CloudServiceTypeController],
  providers: [CloudServiceTypeService],
})
export class CloudServiceTypeModule {}
