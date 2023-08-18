import { ApiProperty } from '@nestjs/swagger/dist';
import { IsEmail, IsUUID } from 'class-validator';

export class JwtPayloadDto {
  @ApiProperty({ description: `User identificator` })
  @IsUUID()
  id: string;

  @ApiProperty({ description: `Account email` })
  @IsEmail()
  email: string;
}
