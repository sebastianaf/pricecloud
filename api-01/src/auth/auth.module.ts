import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { UserModule } from './../user/user.module';
import { AuthController } from './auth.controller';
import { CookieStrategy } from './strategy/cookie.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { View } from './entities/view.entity';
import { RoleView } from './entities/role-view.entity';
import { Role } from './entities/role.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RoleView, View]),
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
    forwardRef(() => UserModule),
    PassportModule,
    PassportModule.register({ defaultStrategy: 'cookie' }),
    forwardRef(() => UserModule),
    CommonModule,
  ],
  providers: [CookieStrategy, AuthService],
  controllers: [AuthController],
  exports: [AuthService, TypeOrmModule],
})
export class AuthModule {}
