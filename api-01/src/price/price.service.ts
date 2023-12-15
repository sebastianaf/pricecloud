import { Repository } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';
import { Installs } from './entities/installs.db-02.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/products.db-02.entity';
import { Stats } from 'fs';

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

  async findAll() {
    try {
      return await this.productsRepository.find({
        where: { vendorName: 'aws' },
        take: 10,
      });
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
}
