import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RawAzure {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
