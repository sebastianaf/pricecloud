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
import { AuthStatusTypeInterface } from '../interfaces/auth-status-type.interface';

@Entity()
@Unique(['user', 'authStatusType'])
export class AuthStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: `User related with the auth status` })
  @ManyToOne(() => User, (user) => user.authStatuses)
  user: User;

  @ApiProperty({ description: `auth's status type` })
  @Column({
    type: 'enum',
    enum: AuthStatusTypeInterface,
  })
  authStatusType: AuthStatusTypeInterface;

  @ApiProperty({ description: `Is auth active` })
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
