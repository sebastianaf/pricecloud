import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RawGcp {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
