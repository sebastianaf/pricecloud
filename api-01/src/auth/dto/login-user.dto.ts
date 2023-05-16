import { ApiProperty } from '@nestjs/swagger/dist';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: `Account email` })
  @IsEmail()
  email: string;

  @ApiProperty({ description: `Password` })
  @IsString()
  password: string;
}
