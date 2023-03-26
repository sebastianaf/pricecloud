import { Module } from '@nestjs/common';
import { CloudServiceService } from './cloud-service.service';
import { CloudServiceController } from './cloud-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudService } from './entities/cloud-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CloudService])],
  controllers: [CloudServiceController],
  providers: [CloudServiceService],
})
export class CloudServiceModule {}
