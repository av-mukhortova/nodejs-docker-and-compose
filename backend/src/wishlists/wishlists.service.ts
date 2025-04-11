import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { validate } from 'class-validator';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(user: User, createWishlistDto: CreateWishlistDto) {
    const wishList = await this.validate(createWishlistDto);
    const items = createWishlistDto.itemsId.map(
      (item): Wish | { id: number } => ({
        id: item,
      }),
    );
    const wishes = await this.wishesRepository.find({
      where: items,
    });
    wishList.owner = user;
    wishList.items = wishes;
    return this.wishlistsRepository.save(wishList);
  }

  findAll() {
    return this.wishlistsRepository.find();
  }

  findOne(id: number) {
    return this.wishlistsRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishList = await this.wishlistsRepository.findOne({
      where: {
        id,
        owner: {
          id: userId,
        },
      },
      relations: {
        owner: true,
      },
    });

    for (const key in updateWishlistDto) {
      if (key === 'itemsId') {
        const items = updateWishlistDto[key].map((item) => {
          return { id: item };
        });
        const wishes = await this.wishesRepository.find({
          where: items,
        });
        wishList.items = wishes;
      } else {
        wishList[key] = updateWishlistDto[key];
      }
    }

    return this.wishlistsRepository.save(wishList);
  }

  async remove(id: number, userId: number) {
    const wishList = await this.wishlistsRepository.findOne({
      where: {
        id,
        owner: {
          id: userId,
        },
      },
      relations: {
        owner: true,
      },
    });
    return await this.wishlistsRepository.remove(wishList);
  }

  private async validate(createWishlistDto: CreateWishlistDto) {
    const wishList = new Wishlist();
    for (const key in createWishlistDto) {
      wishList[key] = createWishlistDto[key];
    }
    const errors = await validate(wishList, { whitelist: true });
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return wishList;
  }
}
