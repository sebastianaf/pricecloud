import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToMany,
  Column,
} from 'typeorm';

import { RoleView } from './role-view.entity';

@Entity()
export class View {
  @ApiProperty({ description: `View's id` })
  @PrimaryColumn('int')
  id: number;

  @ApiProperty({ description: `View's role` })
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
