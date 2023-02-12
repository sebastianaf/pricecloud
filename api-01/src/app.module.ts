import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CloudServiceModule } from './cloud-service/cloud-service.module';
import { CloudServiceTypeModule } from './cloud-service-type/cloud-service-type.module';
import { CloudProviderModule } from './cloud-provider/cloud-provider.module';
import { CloudServiceSkuModule } from './cloud-service-sku/cloud-service-sku.module';
import { RawAzureModule } from './raw-azure/raw-azure.module';
import { RawGcpModule } from './raw-gcp/raw-gcp.module';
import { RawAwsModule } from './raw-aws/raw-aws.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'production' ? false : true,
    }),
    UserModule,
    CloudServiceModule,
    CloudServiceTypeModule,
    CloudProviderModule,
    CloudServiceSkuModule,
    RawAzureModule,
    RawGcpModule,
    RawAwsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
