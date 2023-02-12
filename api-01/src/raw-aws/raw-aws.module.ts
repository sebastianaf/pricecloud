import { Module } from '@nestjs/common';
import { RawAwsService } from './raw-aws.service';
import { RawAwsController } from './raw-aws.controller';

@Module({
  controllers: [RawAwsController],
  providers: [RawAwsService]
})
export class RawAwsModule {}
