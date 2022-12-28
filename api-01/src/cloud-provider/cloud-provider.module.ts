import { Module } from '@nestjs/common';
import { CloudProviderService } from './cloud-provider.service';
import { CloudProviderController } from './cloud-provider.controller';

@Module({
  controllers: [CloudProviderController],
  providers: [CloudProviderService]
})
export class CloudProviderModule {}
