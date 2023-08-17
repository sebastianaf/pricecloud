import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProviders } from './providers/database.providers';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT')),
          database: configService.get('DB_NAME'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          //synchronize: process.env.ENV === 'prod' ? false : true,
          synchronize: false,
        };
      },
    }),
  ],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
