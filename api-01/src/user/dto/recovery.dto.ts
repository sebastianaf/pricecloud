import { ApiProperty } from '@nestjs/swagger/dist';
import { IsEmail } from 'class-validator';

export class RecoveryDto {
  @ApiProperty({ description: `Account email` })
  @IsEmail()
  email: string;
}
