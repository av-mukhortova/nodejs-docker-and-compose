import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Length, IsUrl, IsOptional, Min } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish {
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

  // link
  @Column()
  @IsUrl()
  link: string;

  // image
  @Column()
  @IsUrl()
  image: string;

  // price
  @Column('decimal')
  @Min(1)
  price: number;

  // raised
  @Column('decimal', {
    default: 0,
  })
  raised: number;

  // owner
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  // description
  @Column()
  @Length(1, 1024)
  @IsOptional()
  description: string;

  // copied
  @Column({
    type: 'integer',
    default: 0,
  })
  copied: number;

  // offers
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  // wishlist
  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlist: Wishlist[];
}
