import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PasswordChangeDto {
  @ApiProperty({ description: `Old password` })
  @IsString()
  oldPassword: string;

  @ApiProperty({ description: `New password` })
  @IsString()
  newPassword: string;
}
