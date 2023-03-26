import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: `Email` })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: `Password` })
  @Column({ select: false })
  password: string;

  @ApiProperty({ description: `First name` })
  @Column()
  firstName: string;

  @ApiProperty({ description: `Second name` })
  @Column({ nullable: true })
  secondName: string;

  @ApiProperty({ description: `First Lastname` })
  @Column()
  firstLastName: string;

  @ApiProperty({ description: `Second Lastname` })
  @Column()
  secondLastName: string;

  @ApiProperty({ description: `User's login count` })
  @Column({ default: 0 })
  loginCount: number;

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
