import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CloudServiceSku {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
