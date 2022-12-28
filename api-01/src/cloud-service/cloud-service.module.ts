import { Module } from '@nestjs/common';
import { CloudServiceService } from './cloud-service.service';
import { CloudServiceController } from './cloud-service.controller';

@Module({
  controllers: [CloudServiceController],
  providers: [CloudServiceService]
})
export class CloudServiceModule {}
