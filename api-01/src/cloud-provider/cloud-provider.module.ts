import { Module } from '@nestjs/common';
import { CloudProviderService } from './cloud-provider.service';
import { CloudProviderController } from './cloud-provider.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudProvider } from './entities/cloud-provider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CloudProvider])],
  controllers: [CloudProviderController],
  providers: [CloudProviderService],
})
export class CloudProviderModule {}
