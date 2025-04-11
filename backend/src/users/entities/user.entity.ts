import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  Length,
  IsEmail,
  IsOptional,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class User {
  // id
  @PrimaryGeneratedColumn()
  id: number;

  // createdAt
  @CreateDateColumn()
  createdAt: Date;

  // updatedAt
  @UpdateDateColumn()
  updatedAt: Date;

  // username
  @Column({
    unique: true,
  })
  @Length(2, 30)
  username: string;

  // about
  @Column({
    default: 'Пока ничего не рассказал о себе',
  })
  @Length(2, 200)
  @IsOptional()
  @ValidateIf((_o, value) => value !== '')
  about: string;

  // avatar
  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  @IsUrl()
  @IsOptional()
  avatar: string;

  // email
  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  // password
  @Column({
    select: false,
  })
  password: string;

  // wishes
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  // offers
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  // wishlists
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
