import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

import { CloudProviderModule } from './cloud-provider/cloud-provider.module';
import { CloudServiceSkuModule } from './cloud-service-sku/cloud-service-sku.module';
import { CloudServiceTypeModule } from './cloud-service-type/cloud-service-type.module';
import { CloudServiceModule } from './cloud-service/cloud-service.module';
import { RawAwsModule } from './raw-aws/raw-aws.module';
import { RawAzureModule } from './raw-azure/raw-azure.module';
import { RawGcpModule } from './raw-gcp/raw-gcp.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import environments from './config/environments';
import { SeedModule } from './seed/seed.module';
import config from './config';
import validationSchema from './config/validation-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || `.env`,
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
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: process.env.ENV === 'prod' ? false : true,
        };
      },
    }),
    UserModule,
    CloudProviderModule,
    CloudServiceModule,
    CloudServiceSkuModule,
    CloudServiceTypeModule,
    RawAwsModule,
    RawAzureModule,
    RawGcpModule,
    AuthModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
