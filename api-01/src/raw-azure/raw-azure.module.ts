import { Module } from '@nestjs/common';
import { RawAzureService } from './raw-azure.service';
import { RawAzureController } from './raw-azure.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawAzure } from './entities/raw-azure.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RawAzure])],
  controllers: [RawAzureController],
  providers: [RawAzureService],
})
export class RawAzureModule {}
