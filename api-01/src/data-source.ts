import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: `127.0.0.1`,
  port: 8140,
  username: `pricecloud`,
  password: `VKK24pgTrQKUd2MyxjR2bM8T3dwKdu`,
  database: `pricecloud`,
  synchronize: false,
  logging: true,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: ['src/database/subscribers/**/*.ts'],
  migrationsTableName: 'migrations',
});
