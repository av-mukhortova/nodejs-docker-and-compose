import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';
import { validate } from 'class-validator';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: User, createWishDto: CreateWishDto) {
    const wish = await this.validate(createWishDto);
    wish.owner = user;
    return this.wishesRepository.save(wish);
  }

  findLast() {
    return this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  findTop() {
    return this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async findOne(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        offers: {
          user: true,
        },
        owner: true,
      },
    });
    if (!wish) throw new BadRequestException('Подарок не найден');
    return wish;
  }

  async update(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.wishesRepository.findOne({
      where: {
        id,
        owner: {
          id: userId,
        },
      },
      relations: {
        owner: true,
        offers: true,
      },
    });

    if (wish) {
      if (wish.offers.length === 0) {
        for (const key in updateWishDto) {
          wish[key] = updateWishDto[key];
        }
        return this.wishesRepository.save(wish);
      }
      return wish;
    }
    throw new BadRequestException('Подарок не найден');
  }

  async remove(id: number, userId: number) {
    const wish = await this.wishesRepository.findOne({
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
    if (wish) {
      try {
        return await this.wishesRepository.remove(wish);
      } catch (err) {
        throw new ConflictException(
          'Нельзя удалить подарок, на который уже скинулись',
        );
      }
    }
    throw new BadRequestException('Подарок не найден');
  }

  async copy(user: User, id: number) {
    const wish = await this.wishesRepository.findOneBy({ id });
    if (wish) {
      const currentUser = await this.usersRepository.findOne({
        relations: {
          wishes: true,
        },
        where: {
          id: +user.id,
        },
      });
      const isCurrentUserWish =
        currentUser.wishes.filter((item) => item.id === wish.id).length > 0;
      if (!isCurrentUserWish) {
        const newWish = this.wishesRepository.create(wish);
        newWish.copied = 0;
        newWish.raised = 0;
        newWish.owner = currentUser;
        wish.copied += 1;
        await this.wishesRepository.save(wish);
        await this.wishesRepository.insert(newWish);
      }
      return user;
    }
    throw new BadRequestException('Подарок не найден');
  }

  private async validate(createWishDto: CreateWishDto) {
    const wish = new Wish();
    for (const key in createWishDto) {
      wish[key] = createWishDto[key];
    }
    const errors = await validate(wish, { whitelist: true });
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return wish;
  }
}
