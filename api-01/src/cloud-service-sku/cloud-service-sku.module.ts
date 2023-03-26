import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudServiceSkuService } from './cloud-service-sku.service';
import { CloudServiceSkuController } from './cloud-service-sku.controller';
import { CloudServiceSku } from './entities/cloud-service-sku.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CloudServiceSku])],
  controllers: [CloudServiceSkuController],
  providers: [CloudServiceSkuService],
})
export class CloudServiceSkuModule {}
