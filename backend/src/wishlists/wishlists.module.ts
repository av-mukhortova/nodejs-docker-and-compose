import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, User, Wish])],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
