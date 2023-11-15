import { Module } from '@nestjs/common';
import { ComputeService } from './compute.service';
import { ComputeController } from './compute.controller';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [AuthModule],
  controllers: [ComputeController],
  providers: [ComputeService],
})
export class ComputeModule {}
