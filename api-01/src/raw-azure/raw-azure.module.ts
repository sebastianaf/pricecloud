import { Module } from '@nestjs/common';
import { RawAzureService } from './raw-azure.service';
import { RawAzureController } from './raw-azure.controller';

@Module({
  controllers: [RawAzureController],
  providers: [RawAzureService]
})
export class RawAzureModule {}
