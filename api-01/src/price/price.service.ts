import { Repository } from 'typeorm';
import { GoneException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Installs } from './entities/installs.db-02.entity';
import { Products } from './entities/products.db-02.entity';
import { Stats } from './entities/stats.db-02.entity';
import { VendorInterface } from '../compute/interfaces/vendor.interface';
import { FindProductPriceDto } from './dto/find-product-price.dto';
import { OrderEnum } from './dto/order.dto';
import { OrderByProductPriceEnum } from './interfaces/order-by-product-price.interface';
import { FilterByProductPriceEnum } from './interfaces/filter-by-product-price.interface';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Installs, `db-02`)
    private readonly installsRepository: Repository<Installs>,
    @InjectRepository(Products, `db-02`)
    private readonly productsRepository: Repository<Products>,
  ) {}

  async countVendorProducts() {
    try {
      const data = await this.productsRepository
        .createQueryBuilder('product')
        .select('product."vendorName"', 'vendorName')
        .addSelect('COUNT(*)', 'productCount')
        .groupBy('product."vendorName"')
        .getRawMany();

      return data;
    } catch (error) {
      Logger.error(error);
      throw new GoneException(
        `Error recuperando los vededores de productos (CPF-001)`,
      );
    }
  }

  async findProductFamilybyVendorName(vendorName: string) {
    try {
      const data = await this.productsRepository.query(
        `SELECT "productFamily", count(*) as "productFamilyCount"
        FROM products
        WHERE "vendorName" = '${vendorName}'
        GROUP BY "productFamily"`,
      );

      return data;
    } catch (error) {
      Logger.error(error);
      throw new GoneException(
        `Error recuperando las familias de productos (CPF-001)`,
      );
    }
  }

  async countProductFamilies() {
    try {
      const aws = await this.findProductFamilybyVendorName(VendorInterface.aws);
      const azure = await this.findProductFamilybyVendorName(
        VendorInterface.azure,
      );
      const gcp = await this.findProductFamilybyVendorName(VendorInterface.gcp);
      return { aws, azure, gcp };
    } catch (error) {
      Logger.error(error);
      throw new GoneException(
        `Error recuperando las familias de productos (CPF-001)`,
      );
    }
  }

  async resumeRegionsByVendor(vendorName: string) {
    try {
      const data = await this.installsRepository.query(
        `SELECT "region", "vendorName", count(*) as "regionCount"
        FROM products
        WHERE "vendorName" = '${vendorName}'
        GROUP BY "region", "vendorName"`,
      );

      return data;
    } catch (error) {
      Logger.error(error);
      throw new GoneException(
        `Error recuperando las regiones del CCSP (CPF-001)`,
      );
    }
  }

  async countRegions() {
    try {
      const data = await this.installsRepository.query(
        `SELECT region, count(*) as "regionCount"
        FROM products
        GROUP BY "region"`,
      );

      return data;
    } catch (error) {
      Logger.error(error);
      throw new GoneException(`Error contando las regiones (CPF-001)`);
    }
  }

  async findProductPrice(findProductPriceDto: FindProductPriceDto) {
    const {
      sortOrder = OrderEnum.ASC,
      sortBy = OrderByProductPriceEnum.service,
      filter,
      filterBy = FilterByProductPriceEnum.product,
      limit = 6,
      offset = 0,
    } = findProductPriceDto;
    Logger.debug(findProductPriceDto);

    try {
      const query = this.productsRepository.createQueryBuilder('product');

      if (filter !== undefined && filterBy !== '') {
        Logger.debug(`filter: ${filter}`);
        query.where(`product."${filterBy}" ILIKE :filter`, {
          filter: `%${filter}%`,
        });
      }

      query.orderBy(`product."${sortBy}"`, sortOrder, 'NULLS LAST');
      query.offset(offset);
      query.limit(limit);

      const data = await query.getManyAndCount();

      Logger.verbose(data[1]);
      Logger.debug(data[0].length);

      if (filter !== undefined && filterBy !== '')
        return [data.slice(offset, limit + offset), data[1]];
      return data;
    } catch (error) {
      Logger.error(error);
      throw new GoneException(`Error recuperando los precios (CPF-001)`);
    }
  }
}
