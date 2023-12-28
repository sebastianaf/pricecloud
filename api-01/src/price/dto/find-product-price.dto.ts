import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { OrderByProductPriceEnum } from '../interfaces/order-by-product-price.interface';
import { OrderEnum } from './order.dto';

export class FindProductPriceDto {
  @ApiProperty({
    description: 'Campo para hacer el ordenamiento',
  })
  @IsEnum(OrderByProductPriceEnum)
  @IsOptional()
  sortBy?: OrderByProductPriceEnum;

  @ApiProperty({
    description: 'Indica el tipo de orden ascendente (ASC) o descendente(DESC)',
  })
  @IsEnum(OrderEnum)
  @IsOptional()
  sortOrder?: OrderEnum;

  @ApiProperty({
    description: `Campo para hacer la búsqueda.`,
  })
  @IsString()
  @IsOptional()
  filterBy?: string;

  @ApiProperty({
    description: `Valor del campo para hacer la búsqueda.`,
  })
  @IsString()
  @IsOptional()
  filter?: string;

  @ApiProperty({
    description: 'Limita el número de registros de la petición.',
  })
  @IsNumberString({ no_symbols: true })
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'Omite los "offset" primeros registros de la petición.',
  })
  @IsNumberString()
  @IsOptional()
  offset?: number;
}
