import { Controller, Body, Put, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

import { NotificationService } from './notification.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Protect } from '../auth/decorators/protect.decorator';
import { ViewInterface } from '../auth/interfaces/view.interface';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { defaultNotificationStatus } from './interfaces/notification-status-type.interface';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(`status`)
  @ApiOperation({ summary: `Get user's notifications status` })
  @ApiResponse({
    status: 200,
    schema: {
      example: defaultNotificationStatus,
    },
  })
  @Protect([ViewInterface.profile])
  findAll(@GetUser() user: User) {
    return this.notificationService.findOneStatus(user);
  }

  @Put(`status`)
  @ApiOperation({ summary: `Update user's notifications` })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        message: `Configuración aplicada exitosamente`,
      },
    },
  })
  @Protect([ViewInterface.profile])
  update(
    @Body() updateNotificationDto: UpdateNotificationDto,
    @GetUser() user: User,
  ) {
    return this.notificationService.updateStatus(updateNotificationDto, user);
  }
}
