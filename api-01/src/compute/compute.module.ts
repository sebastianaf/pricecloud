import { Module } from '@nestjs/common';
import { ComputeService } from './compute.service';
import { ComputeController } from './compute.controller';

@Module({
  controllers: [ComputeController],
  providers: [ComputeService],
})
export class ComputeModule {}
