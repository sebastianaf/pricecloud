import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { LoginEventInterface } from '../interfaces/login-event.interface';
import { EncryptionTransformer } from '../transformer/encryption.transformer';
import { ObjectEncryptionTransformer } from '../transformer/object-encryption.transformer';
import { UserAgentInterface } from '../../common/interfaces/user-agent.interface';

@Entity()
export class Login {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @ApiProperty({ description: `User related with the login` })
  @ManyToOne(() => User, (user) => user.logins, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ description: `User's login IP` })
  @Column({ nullable: true, transformer: EncryptionTransformer })
  ip: string;

  @ApiProperty({ description: `User's login location` })
  @Column({ nullable: true, transformer: EncryptionTransformer })
  location: string;

  @ApiProperty({ description: `User's login timezone` })
  @Column({ nullable: true, transformer: EncryptionTransformer })
  timezone: string;

  @ApiProperty({ description: `User's login user agent data` })
  @Column({
    type: `text`,
    nullable: true,
    transformer: ObjectEncryptionTransformer,
  })
  userAgent: UserAgentInterface;

  @ApiProperty({ description: `User's login event type` })
  @Column({
    type: `enum`,
    enum: LoginEventInterface,
    default: LoginEventInterface.login,
  })
  event: LoginEventInterface;

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
