import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum } from 'class-validator';
import { NotificationTypeInterface } from '../interfaces/notification-type.interface';

export class UpdateNotificationDto {
  @ApiProperty({
    description: `Notification type`,
    enum: NotificationTypeInterface,
  })
  @IsEnum(NotificationTypeInterface, { message: 'Invalid notification type' })
  notificationType: NotificationTypeInterface;

  @ApiProperty({ description: `Active status`, example: true })
  @IsBoolean({ message: 'Invalid active status' })
  active: boolean;
}
