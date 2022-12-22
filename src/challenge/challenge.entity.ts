import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Solve } from './solve.entity';

@Entity()
export class Challenge {
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
}
