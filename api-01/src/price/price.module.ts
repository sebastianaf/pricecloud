import { Module } from '@nestjs/common';
import { PriceGateway } from './price.gateway';

@Module({
  providers: [PriceGateway]
})
export class PriceModule {}
