import { Module } from '@nestjs/common';
import { RawGcpService } from './raw-gcp.service';
import { RawGcpController } from './raw-gcp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawGcp } from './entities/raw-gcp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RawGcp])],
  controllers: [RawGcpController],
  providers: [RawGcpService]
})
export class RawGcpModule {}
