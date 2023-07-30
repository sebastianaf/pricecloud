import { Logger, Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [Logger],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
