import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { CommonModule } from '../common/common.module';
import { Log } from '../log/entities/log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Log]),
    forwardRef(() => AuthModule),
    EmailModule,
    CommonModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
