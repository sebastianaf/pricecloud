import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { environments } from './environments';
import config from './config';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || `.env`,
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().min(2).max(3).required(),
        DB_HOST: Joi.string().ip().required(),
        DB_PORT: Joi.number().min(100).max(65535).required(),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        ENV: Joi.string().equal(`dev`, `prod`).required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: process.env.ENV === 'prod' ? false : true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      //logging: true,
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
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
