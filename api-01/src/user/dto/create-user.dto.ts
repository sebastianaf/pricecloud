import { ApiProperty } from '@nestjs/swagger/dist';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: `Account email` })
  @IsEmail()
  email: string;

  @ApiProperty({ description: `Password` })
  @IsString()
  password: string;

  @ApiProperty({ description: `User's first name` })
  @IsString()
  firstName: string;

  @ApiProperty({ description: `User's second name` })
  @IsString()
  @IsOptional()
  secondName?: string;

  @ApiProperty({ description: `User's first Lastname` })
  @IsString()
  firstLastName: string;

  @ApiProperty({ description: `User's second Lastname` })
  @IsString()
  @IsOptional()
  secondLastName?: string;
}
