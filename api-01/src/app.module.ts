import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import environments from './config/environments';
import { SeedModule } from './seed/seed.module';
import { DatabaseModule } from './database/database.module';
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
    UserModule,
    AuthModule,
    SeedModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
