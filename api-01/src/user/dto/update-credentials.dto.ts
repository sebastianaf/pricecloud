import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString } from 'class-validator';
export class UpdateCredentialsDto {
  @ApiProperty({ description: 'aws accessId' })
  @IsString()
  @IsOptional()
  awsAccessId?: string;

  @ApiProperty({ description: 'aws SecretKey' })
  @IsString()
  @IsOptional()
  awsSecretKey?: string;
}
