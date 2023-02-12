import { Module } from '@nestjs/common';
import { CloudServiceSkuService } from './cloud-service-sku.service';
import { CloudServiceSkuController } from './cloud-service-sku.controller';

@Module({
  controllers: [CloudServiceSkuController],
  providers: [CloudServiceSkuService]
})
export class CloudServiceSkuModule {}
