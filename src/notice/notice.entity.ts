import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notice')
export class Notice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255, nullable: false })
  title: string;

  @Column('varchar', { length: 255, nullable: false })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
