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
import { Login } from '../../auth/entities/login.entity';
import { VerificationCode } from '../../auth/entities/verification-code.entity';
import {
  SettingsInterface,
  settingsDefault,
} from '../interfaces/settings.interface';
import {
  CredentialsInterface,
  credentialsDefault,
} from '../interfaces/credentials.interface';
import { ObjectEncryptionTransformer } from '../../auth/transformer/object-encryption.transformer';
import { Log } from '../../log/entities/log.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: `User's logs from events` })
  @OneToMany(
    () => Log,
    (log) => log.user,
  )
  logs: Log[];

  @ApiProperty({ description: `User's verification codes` })
  @OneToMany(
    () => VerificationCode,
    (verificationCode) => verificationCode.user,
  )
  verificationsCodes: VerificationCode[];

  @ApiProperty({ description: `User's logins` })
  @OneToMany(() => Login, (login) => login.user)
  logins: Login[];

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

  @ApiProperty({ description: `User's ISO2 country code` })
  @Column({ nullable: true, transformer: EncryptionTransformer })
  country: string;

  @ApiProperty({ description: `User's timezone` })
  @Column({ nullable: true, transformer: EncryptionTransformer })
  timezone: string;

  @ApiProperty({ description: `User's account status is enable` })
  @Column({ default: true })
  active: boolean;

  @ApiProperty({ description: `User's language` })
  @Column({ default: 'es' })
  language: string;

  @ApiProperty({ description: `User's settings parameters` })
  @Column({ type: 'json', nullable: true, default: settingsDefault })
  settings: SettingsInterface;

  @ApiProperty({ description: `User's deploy credentials` })
  @Column({
    type: 'text',
    default: credentialsDefault,
    transformer: ObjectEncryptionTransformer,
  })
  credentials: CredentialsInterface;

  @ApiProperty({ description: `User's created at` })
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty({ description: `User's updated at` })
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
