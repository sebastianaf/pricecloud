import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateSettingsDto {
  @ApiProperty({ description: 'Multi-factor authentication flag' })
  @IsOptional()
  @IsBoolean()
  authMfa?: boolean;

  @ApiProperty({ description: 'Flag for price database update notifications' })
  @IsBoolean()
  @IsOptional()
  notificationEmailPriceDbUpdated?: boolean;

  @ApiProperty({ description: 'Flag for newsletter subscription' })
  @IsBoolean()
  @IsOptional()
  notificationEmailNewsletter?: boolean;
}
