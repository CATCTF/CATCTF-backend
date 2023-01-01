import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { File } from './file.entity';
import { Solve } from './solve.entity';

@Entity()
export class Challenge extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @Column('varchar', { length: 255, nullable: false })
  description: string;

  @Column('varchar', { length: 255, nullable: false })
  flag: string;

  @Column('varchar', { length: 255, nullable: false })
  category: string;

  @Column('integer', { default: 500 })
  point: number;

  @Column('integer', { default: 0 })
  solve: number;

  @Column('varchar', { length: 255, nullable: true })
  hint: string;

  @Column('varchar', { length: 255, nullable: true })
  connection: string;

  @Column('boolean', { default: false })
  show: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Solve, (solve) => solve.challenge)
  @JoinColumn()
  solves: Solve[];

  @OneToOne(() => File, (file) => file.challenge, { eager: true })
  @JoinColumn()
  file: File;
}
