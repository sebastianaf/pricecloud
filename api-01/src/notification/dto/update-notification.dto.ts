import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum } from 'class-validator';
import { NotificationStatusTypeInterface } from '../interfaces/notification-status-type.interface';

export class UpdateNotificationDto {
  @ApiProperty({
    description: `Notification type`,
    enum: NotificationStatusTypeInterface,
  })
  @IsEnum(NotificationStatusTypeInterface, { message: 'Invalid notification type' })
  notificationStatusType: NotificationStatusTypeInterface;

  @ApiProperty({ description: `Active status`, example: true })
  @IsBoolean({ message: 'Invalid active status' })
  active: boolean;
}
