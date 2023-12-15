import { Module } from '@nestjs/common';
import { PriceGateway } from './price.gateway';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';

@Module({
  providers: [PriceGateway, PriceService],
  controllers: [PriceController]
})
export class PriceModule {}
