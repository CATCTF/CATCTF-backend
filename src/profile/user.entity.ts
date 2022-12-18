import { Column, Entity, PrimaryColumn } from 'typeorm';

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
}
