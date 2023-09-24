import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';

import { AuthService } from './auth.service';
import { UserModule } from './../user/user.module';
import { AuthController } from './auth.controller';
import { CookieStrategy } from './strategy/cookie.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          signOptions: {
            expiresIn: configService.get('API_JWT_EXPIRATION_TIME'),
          },
          secret: configService.get('API_JWT_SECRET'),
        };
      },
    }),
    UserModule,
    PassportModule,
    PassportModule.register({ defaultStrategy: 'cookie' }),
  ],
  providers: [AuthService, CookieStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
