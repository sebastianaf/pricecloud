import { Module } from '@nestjs/common';
import { ComputeService } from './compute.service';
import { ComputeController } from './compute.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { LogModule } from '../log/log.module';
@Module({
  imports: [AuthModule, UserModule, LogModule],
  controllers: [ComputeController],
  providers: [ComputeService],
})
export class ComputeModule {}
