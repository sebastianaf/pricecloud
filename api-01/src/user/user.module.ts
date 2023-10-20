import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { UserGateway } from './user.gateway';
import { EmailModule } from '../email/email.module';
import { CommonModule } from '../common/common.module';
import { UserLogin } from './entities/user-login.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserLogin]),
    forwardRef(() => AuthModule),
    EmailModule,
    CommonModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserGateway],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
