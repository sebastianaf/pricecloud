import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Max } from 'class-validator';

export class CreateStorageDto {
  @ApiProperty({ description: `Bucket name` })
  @IsNotEmpty({ message: `Debes ingresar una nombre para tu bucket. ` })
  @IsString({ message: `Debes ingresar una nombre para tu bucket. ` })
  bucketName: string;
}
