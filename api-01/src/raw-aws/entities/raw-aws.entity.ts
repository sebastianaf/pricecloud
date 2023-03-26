import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RawAws {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
