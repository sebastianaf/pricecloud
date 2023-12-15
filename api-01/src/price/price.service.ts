import { Repository } from 'typeorm';
import { GoneException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Installs } from './entities/installs.db-02.entity';
import { Products } from './entities/products.db-02.entity';
import { Stats } from './entities/stats.db-02.entity';

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
      const data = await this.productsRepository
        .createQueryBuilder('product')
        .select('product."productFamily"', 'productFamily')
        .addSelect('COUNT(*)', 'productFamily')
        .where(`product."vendorName" = :vendorName`, { vendorName })
        .groupBy('product."productFamily"')
        .getCount();

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
      const data = await this.productsRepository
        .createQueryBuilder('product')
        .select('product."productFamily"', 'productFamily')
        .addSelect('COUNT(*)', 'productFamily')
        .groupBy('product."productFamily"')
        .getRawMany();

      return data;
    } catch (error) {
      Logger.error(error);
      throw new GoneException(
        `Error recuperando las familias de productos (CPF-001)`,
      );
    }
  }
}
