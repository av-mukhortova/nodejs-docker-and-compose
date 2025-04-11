import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsBoolean, Min } from 'class-validator';

@Entity()
export class Offer {
  // id
  @PrimaryGeneratedColumn()
  id: number;

  // createdAt
  @CreateDateColumn()
  createdAt: Date;

  // updatedAt
  @UpdateDateColumn()
  updatedAt: Date;

  // amount
  @Column('decimal')
  @Min(1)
  amount: number;

  // hidden
  @Column({
    default: false,
  })
  @IsBoolean()
  hidden: boolean;

  // user
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  // wish
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
}
