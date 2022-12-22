
import { Solve } from 'src/challenge/solve.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('varchar', { length: 36 })
  id!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { length: 255 })
  email!: string;

  @Column('varchar', { length: 255 })
  password!: string;

  @Column('varchar', { length: 255 })
  school!: string;

  @Column('boolean', { default: false })
  isAdmin!: boolean;

  @Column('integer', { default: 0 })
  point!: number;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Solve, (solve) => solve.user)
  @JoinColumn()
  solves: Solve[];
}
