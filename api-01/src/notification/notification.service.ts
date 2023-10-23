import { Injectable } from '@nestjs/common';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationStatus } from './entities/notification-status.entity';
import { User } from '../user/entities/user.entity';
import {
  NotificationStatusInterface,
  defaultNotificationStatus,
} from './interfaces/notification-status-type.interface';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationStatus)
    private readonly notificationStatusRepository: Repository<NotificationStatus>,
  ) {}

  async findOneStatus(user: User): Promise<NotificationStatusInterface> {
    const notificationStatuses = await this.notificationStatusRepository.find({
      where: { user: <any>{ id: user.id } },
    });

    const notificationStatus: NotificationStatusInterface =
      defaultNotificationStatus;

    notificationStatuses.forEach((setting) => {
      notificationStatus[setting.notificationStatusType] = setting.active;
    });

    return notificationStatus;
  }

  async updateStatus(updateNotificationDto: UpdateNotificationDto, user: User) {
    const { notificationStatusType, active } = updateNotificationDto;

    const existingNotification =
      await this.notificationStatusRepository.findOne({
        where: { user: <any>{ id: user.id }, notificationStatusType },
      });

    if (existingNotification) {
      existingNotification.active = active;
      await this.notificationStatusRepository.save(existingNotification);
    } else {
      await this.notificationStatusRepository.save({
        notificationStatusType,
        active,
        user,
      });
    }

    return {
      message: `Configuración aplicada exitosamente`,
    };
  }
}
