import { Module } from '@nestjs/common';
import { RawGcpService } from './raw-gcp.service';
import { RawGcpController } from './raw-gcp.controller';

@Module({
  controllers: [RawGcpController],
  providers: [RawGcpService]
})
export class RawGcpModule {}
