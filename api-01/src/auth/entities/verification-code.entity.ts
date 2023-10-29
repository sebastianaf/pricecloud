import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class VerificationCode {
  @ApiProperty({ description: `Verification code id` })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: `User's reference` })
  @ManyToOne(() => User, (user) => user.verificationsCodes, {
    onDelete: `CASCADE`,
  })
  user: User;

  @ApiProperty({ description: `Six-digit verification code ` })
  @Column()
  code: number;

  @ApiProperty({ description: `Verification code times used` })
  @Column()
  timesUsed: number;

  @ApiProperty({ description: `Verification code id creation date` })
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty({ description: `Verification code update date` })
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
