import { Module } from '@nestjs/common';
import { PriceGateway } from './price.gateway';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installs } from './entities/installs.db-02.entity';
import { Products } from './entities/products.db-02.entity';
import { Stats } from './entities/stats.db-02.entity';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Installs, Products, Stats], `db-02`),
    AuthModule,
    DatabaseModule,
  ],
  providers: [PriceGateway, PriceService],
  controllers: [PriceController],
  exports: [PriceService],
})
export class PriceModule {}
