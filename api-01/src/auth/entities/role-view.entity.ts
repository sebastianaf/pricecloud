import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Role } from './role.entity';
import { View } from './view.entity';

@Entity()
@Unique(`unique_role_view`, [`role`, `view`])
export class RoleView {
  @ApiProperty({ description: `RoleView's id` })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: `View's reference` })
  @ManyToOne(() => Role, (role) => role.roleViews, { onDelete: `CASCADE` })
  role: Role;

  @ApiProperty({ description: `View's reference` })
  @ManyToOne(() => View, (view) => view.roleViews, { onDelete: `CASCADE` })
  view: View;

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
