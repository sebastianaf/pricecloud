import { Repository } from 'typeorm';
import { GoneException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Installs } from './entities/installs.db-02.entity';
import { Products } from './entities/products.db-02.entity';
import { Stats } from './entities/stats.db-02.entity';
import { VendorInterface } from '../compute/interfaces/vendor.interface';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Installs, `db-02`)
    private readonly installsRepository: Repository<Installs>,
    @InjectRepository(Products, `db-02`)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Stats, `db-02`)
    private readonly statsRepository: Repository<Stats>,
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
}
