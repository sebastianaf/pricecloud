import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EncryptionLowerCaseTransformer } from '../../auth/transformer/encryption-lowercase.transformer';
import { EncryptionTransformer } from '../../auth/transformer/encryption.transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: `Testing migration field` })
  @Column({ nullable: true, transformer: EncryptionLowerCaseTransformer })
  dummyField: string;

  @ApiProperty({ description: `Testing migration field 2` })
  @Column({ nullable: true, transformer: EncryptionLowerCaseTransformer })
  dummyField2: string;

  @ApiProperty({ description: `Testing migration field 3` })
  @Column({ nullable: true, transformer: EncryptionLowerCaseTransformer })
  dummyField3: string;

  @ApiProperty({ description: `Email` })
  @Column({ unique: true, transformer: EncryptionLowerCaseTransformer })
  email: string;

  @ApiProperty({ description: `Password` })
  @Exclude({ toPlainOnly: true })
  @Column({ select: false })
  password: string;

  @ApiProperty({ description: `First name` })
  @Column({
    transformer: EncryptionTransformer,
  })
  firstName: string;

  @ApiProperty({ description: `Second name` })
  @Column({ nullable: true, transformer: EncryptionTransformer })
  secondName: string;

  @ApiProperty({ description: `First Lastname` })
  @Column({ transformer: EncryptionTransformer })
  firstLastName: string;

  @ApiProperty({ description: `Second Lastname` })
  @Column({ transformer: EncryptionTransformer })
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
