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
import { NotificationStatusTypeInterface } from '../interfaces/notification-status-type.interface';

@Entity()
@Unique(['user', 'notificationStatusType'])
export class NotificationStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: `User related with the notification status` })
  @ManyToOne(() => User, (user) => user.notificationStatuses)
  user: User;

  @ApiProperty({ description: `Notification's status type` })
  @Column({
    type: 'enum',
    enum: NotificationStatusTypeInterface,
  })
  notificationStatusType: NotificationStatusTypeInterface;

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
