import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUUID } from 'class-validator';

export class JwtPayloadDto {
  @ApiProperty({ description: `User identificator` })
  @IsUUID()
  id: string;
}
