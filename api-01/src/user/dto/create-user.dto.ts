import { ApiProperty } from "@nestjs/swagger/dist";
import { IsString, IsOptional } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ description: `First name` })
  @IsString()
  firstName: string;

  @ApiProperty({ description: `Second name` })
  @IsString()
  @IsOptional()
  secondName?: string;

  @ApiProperty({ description: `First Lastname` })
  @IsString()
  firstLastName: string;

  @ApiProperty({ description: `Second Lastname` })
  @IsString()
  @IsOptional()
  secondLastName?: string;
}
