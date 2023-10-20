import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { EncryptionLowerCaseTransformer } from '../../auth/transformer/encryption-lowercase.transformer';
import { EncryptionTransformer } from '../../auth/transformer/encryption.transformer';
import { Role } from '../../auth/entities/role.entity';
import { UserLogin } from './user-login.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => UserLogin, (userLogin) => userLogin.user)
  userLogins: UserLogin[];

  @ApiProperty({ description: `User's role` })
  @ManyToOne(() => Role, (role) => role.users, { nullable: false })
  role: Role;

  @ApiProperty({ description: `Email` })
  @Column({ unique: true, transformer: EncryptionLowerCaseTransformer })
  email: string;

  @ApiProperty({ description: `Company`, nullable: true })
  @Column({ nullable: true, transformer: EncryptionLowerCaseTransformer })
  company: string;

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

  @ApiProperty({ description: `Second Lastname`, nullable: true })
  @Column({ nullable: true, transformer: EncryptionTransformer })
  secondLastName: string;

  @ApiProperty({ description: `User's login count` })
  @Column({ default: 0 })
  loginCount: number;

  @ApiProperty({ description: `User's email verification status` })
  @Column({ default: false })
  isEmailVerified: boolean;

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
