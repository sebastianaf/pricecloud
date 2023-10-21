import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import environments from './config/environments';
import { SeedModule } from './seed/seed.module';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { CommonModule } from './common/common.module';
import config from './config';
import validationSchema from './config/validation-schema';
import { UserAgentMiddleware } from './auth/middlewares/user-agent.middleware';

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
    EmailModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAgentMiddleware).forRoutes('*');
  }
}
