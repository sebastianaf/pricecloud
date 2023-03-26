import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CloudServiceType {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
