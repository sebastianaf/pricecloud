import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Column,
} from 'typeorm';

@Entity()
export class PriceCount {
  @ApiProperty({ description: `Id` })
  @PrimaryColumn('varchar')
  id: string;

  @ApiProperty({ description: `Count from value id` })
  @Column()
  count: number;

  @ApiProperty({ description: `View's reference` })
  @ApiProperty({ description: `creation date` })
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty({ description: `updated date` })
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
