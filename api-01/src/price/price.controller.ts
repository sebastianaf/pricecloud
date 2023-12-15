import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Protect } from '../auth/decorators/protect.decorator';
import { ViewInterface } from '../auth/interfaces/view.interface';
import { PriceService } from './price.service';

@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get(`count-vendor-products`)
  @ApiOperation({ summary: `Get CCSPs product count` })
  @Protect([ViewInterface.dashboard])
  countVendorProducts() {
    return this.priceService.countVendorProducts();
  }

  @Get(`count-product-families`)
  @ApiOperation({ summary: `Get CCSPs product families count` })
  @Protect([ViewInterface.dashboard])
  countProductFamilies() {
    return this.priceService.countProductFamilies();
  }
}
