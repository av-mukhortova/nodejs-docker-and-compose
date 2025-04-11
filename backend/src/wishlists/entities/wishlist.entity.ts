import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Length, IsUrl } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist {
  // id
  @PrimaryGeneratedColumn()
  id: number;

  // createdAt
  @CreateDateColumn()
  createdAt: Date;

  // updatedAt
  @UpdateDateColumn()
  updatedAt: Date;

  // name
  @Column()
  @Length(1, 250)
  name: string;

  // image
  @Column()
  @IsUrl()
  image: string;

  // user
  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  // items
  @ManyToMany(() => Wish, (wish) => wish.wishlist)
  @JoinTable()
  items: Wish[];
}
