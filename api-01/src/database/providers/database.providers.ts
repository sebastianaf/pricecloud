import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { dataSource } from '../../config/constants';

export const databaseProviders = [
  {
    provide: dataSource,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT')),
        database: configService.get('DB_NAME'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        //synchronize: process.env.ENV === 'prod' ? false : true,
        synchronize: false,
      });

      return dataSource.initialize();
    },
  },
];
