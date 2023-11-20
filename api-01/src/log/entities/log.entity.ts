import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ObjectEncryptionTransformer } from '../../auth/transformer/object-encryption.transformer';
import { LogTypeInterface } from '../interfaces/log-type.interface';

@Entity()
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: `User's verification codes` })
  @ManyToOne(() => User, (user) => user.logs)
  user: User;

  @ApiProperty({ description: `Error message` })
  @Column()
  message: string;

  @ApiProperty({ description: `Error Type` })
  @Column({
    type: `enum`,
    enum: LogTypeInterface,
    default: LogTypeInterface.info,
  })
  logType: LogTypeInterface;

  @ApiProperty({ description: `Error stacktrace if exist` })
  @Column({
    type: 'text',
    nullable: true,
    transformer: ObjectEncryptionTransformer,
  })
  stack: Object;

  @ApiProperty({ description: `Created at timestamp` })
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty({ description: `Last updated at timestamp` })
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
