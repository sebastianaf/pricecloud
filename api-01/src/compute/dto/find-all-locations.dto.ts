import { ApiProperty } from '@nestjs/swagger';
import { IsString, Max } from 'class-validator';

export class findAllLocationsDto {
  @ApiProperty({ description: `Keyword to seach` })
  @Max(20, { message: `Por favor intenta con una palabra mas corta. ` })
  @IsString({ message: `Debes buscar con una palabra` })
  keyWord: string;
}
