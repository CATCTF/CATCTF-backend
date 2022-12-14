import { User } from 'src/profile/user.entity';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Challenge } from './challenge.entity';

@Entity()
export class Solve extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.solves, { eager: true })
  @JoinColumn()
  user!: User;

  @ManyToOne(() => Challenge, (challenge) => challenge.solves, { eager: true })
  @JoinColumn()
  challenge!: Challenge;
}
