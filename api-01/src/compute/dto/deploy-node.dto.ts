import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Max } from 'class-validator';

export class DeployNodeDto {
  @ApiProperty({ description: `Node name` })
  @IsNotEmpty({ message: `Debes ingresar una nombre para tu instancia. ` })
  @IsString({ message: `Debes ingresar una nombre para tu instancia. ` })
  nodeName: string;

  @ApiProperty({ description: `Image identifier` })
  @IsNotEmpty({ message: `Debes ingresar una imagen para tu instancia. ` })
  @IsString({ message: `Debes ingresar una nombre para tu instancia. ` })
  imageId: string;

  @ApiProperty({ description: `Size identifier` })
  @IsNotEmpty({ message: `Debes ingresar el tamaño de tu instancia. ` })
  @IsString({ message: `Debes ingresar el tamaño de tu instancia. ` })
  sizeId: string;
}
