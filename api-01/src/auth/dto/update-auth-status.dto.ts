import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum } from 'class-validator';
import { AuthStatusTypeInterface } from '../interfaces/auth-status-type.interface';

export class UpdateAuthStatusDto {
  @ApiProperty({
    description: `AuthStatusType`,
    enum: AuthStatusTypeInterface,
  })
  @IsEnum(AuthStatusTypeInterface, { message: ' Invalid auth status type ' })
  authStatusType: AuthStatusTypeInterface;

  @ApiProperty({ description: `Active status`, example: true })
  @IsBoolean({ message: ' Invalid active status ' })
  active: boolean;
}
