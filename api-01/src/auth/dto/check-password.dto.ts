import { ApiProperty } from '@nestjs/swagger/dist';
import { IsString, IsEmail } from 'class-validator';
import { User } from '../../user/entities/user.entity';

export class ChangePasswordDto {
  @ApiProperty({ description: `User to be changed` })
  @IsEmail()
  user: User;

  @ApiProperty({ description: `Password` })
  @IsString()
  password: string;
}
