import { Module } from '@nestjs/common';
import { RawAwsService } from './raw-aws.service';
import { RawAwsController } from './raw-aws.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawAws } from './entities/raw-aws.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RawAws])],
  controllers: [RawAwsController],
  providers: [RawAwsService],
})
export class RawAwsModule {}
