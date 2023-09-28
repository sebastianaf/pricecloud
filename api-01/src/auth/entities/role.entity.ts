import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { RoleView } from './role-view.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Role {
  @ApiProperty({ description: `Role's id` })
  @PrimaryColumn('int')
  id: number;

  @ApiProperty({ description: `Role's users` })
  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ApiProperty({ description: `Role's views` })
  @OneToMany(() => RoleView, (roleView) => roleView.role)
  roleViews: RoleView[];

  @ApiProperty({ description: `Role's label` })
  @Column()
  label: string;

  @ApiProperty({ description: `Role's create date` })
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty({ description: `Role's last updated date` })
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
