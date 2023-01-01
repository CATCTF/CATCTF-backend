import { Solve } from 'src/challenge/solve.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
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

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Solve, (solve) => solve.user)
  @JoinColumn()
  solves: Solve[];
}
