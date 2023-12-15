import { ConflictException, Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Protect } from '../auth/decorators/protect.decorator';
import { ViewInterface } from '../auth/interfaces/view.interface';
import { PriceService } from './price.service';
import { HttpStatusCode } from 'axios';

@ApiResponse({
  status: HttpStatusCode.Conflict,
  schema: { example: new ConflictException() },
})
@ApiBearerAuth()
@ApiTags('price')
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get(`count-vendor-products`)
  @ApiOperation({ summary: `Get CCSPs product count` })
  @Protect([ViewInterface.dashboard])
  countVendorProducts() {
    return this.priceService.countVendorProducts();
  }

  @Get(`product-families`)
  @ApiOperation({ summary: `Get CCSPs product families count` })
  @Protect([ViewInterface.dashboard])
  countProductFamilies() {
    return this.priceService.countProductFamilies();
  }

  @Get(`resume-regions-by-vendor`)
  @ApiOperation({ summary: `Get regions by vendor` })
  @Protect([ViewInterface.dashboard])
  resumeRegionsByVendor(@Query('vendorName') vendorName: string) {
    return this.priceService.resumeRegionsByVendor(vendorName);
  }
}
