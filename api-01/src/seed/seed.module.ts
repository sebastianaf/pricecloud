import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SeedService } from './seed.service';
import { UserModule } from '../user/user.module';
import config from '../common/config';
import environments from '../common/environments';
import validationSchema from '../common/validation-schema';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.ENV] || `.env`,
      load: [config],
      isGlobal: true,
      validationSchema,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [SeedService],
})
export class SeedModule {}
