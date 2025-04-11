import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Offer } from './offers/entities/offer.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { HashingModule } from './hashing/hashing.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('postgres_host'),
        port: 5432,
        username: config.get<string>('postgres_user'),
        password: config.get<string>('postgres_password'),
        database: config.get<string>('postgres_db'),
        entities: [User, Wish, Offer, Wishlist],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    HashingModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
