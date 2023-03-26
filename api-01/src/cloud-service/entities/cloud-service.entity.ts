import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CloudService {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
