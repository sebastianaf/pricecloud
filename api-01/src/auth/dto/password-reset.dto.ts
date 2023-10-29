import { ApiProperty } from '@nestjs/swagger/dist';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PasswordResetDto {
  @ApiProperty({ description: `Password attemp 1` })
  @IsString()
  password: string;

  @ApiProperty({ description: `Token data ` })
  @IsString()
  @IsNotEmpty()
  token: string;
}
