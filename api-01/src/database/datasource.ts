import { DataSource } from 'typeorm';
require('dotenv').config();
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Globs relativos a __dirname, no al cwd: compilado a
  // dist/database/datasource.js resuelve dist/**/*.entity.js, y bajo ts-node
  // resuelve src/**/*.entity.ts. Con las rutas fijas a 'src/**' el
  // `migrations:run:prod` del contenedor intentaba cargar los .ts, que sin
  // ts-node (podado en la imagen de produccion) no se pueden requerir.
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  synchronize: false,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
