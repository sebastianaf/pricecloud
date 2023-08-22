import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SeedService } from './seed.service';
import { UserModule } from '../user/user.module';
import config from '../config';
import environments from '../config/environments';
import validationSchema from '../config/validation-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.ENV] || `.env`,
      load: [config],
      isGlobal: true,
      validationSchema,
    }),
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
          autoLoadEntities: true,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: false,
        };
      },
    }),
    UserModule,
  ],
  controllers: [],
  providers: [SeedService, Logger],
})
export class SeedModule {}
