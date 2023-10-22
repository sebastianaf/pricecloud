import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { NotificationTypeInterface } from '../interfaces/notification-type.interface';

@Entity()
@Unique(['user', 'notificationType'])
export class NotificationStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: `User related with the notification status` })
  @ManyToOne(() => User, (user) => user.notificationStatuses)
  user: User;

  @ApiProperty({ description: `Notification's type` })
  @Column({
    type: 'enum',
    enum: NotificationTypeInterface,
  })
  notificationType: NotificationTypeInterface;

  @ApiProperty({ description: `Is notification active` })
  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
