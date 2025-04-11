import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { validate } from 'class-validator';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto) {
    const offer = await this.validate(createOfferDto);
    const wish = await this.wishesRepository.findOneBy({
      id: +createOfferDto.itemId,
    });
    if (wish) {
      const currentUser = await this.usersRepository.findOne({
        relations: {
          wishes: true,
        },
        where: {
          id: user.id,
        },
      });
      const isCurrentUserWish =
        currentUser.wishes.filter((item) => item.id === wish.id).length > 0;
      if (!isCurrentUserWish) {
        offer.user = currentUser;
        offer.item = wish;
        wish.raised = +wish.raised + +createOfferDto.amount;
        if (wish.raised <= wish.price) {
          await this.wishesRepository.save(wish);
          return this.offersRepository.save(offer);
        }
        throw new BadRequestException('Собранная сумма превышает цену подарка');
      }
      throw new BadRequestException('Нельзя скинуться на свой подарок');
    }
    throw new BadRequestException('Подарок не найден');
  }

  findAll() {
    return this.offersRepository.find({
      relations: {
        user: true,
        item: true,
      },
    });
  }

  findOne(id: number) {
    return this.offersRepository.findOneBy({ id });
  }

  private async validate(createOfferDto: CreateOfferDto) {
    const offer = new Offer();
    for (const key in createOfferDto) {
      offer[key] = createOfferDto[key];
    }
    const errors = await validate(offer, { whitelist: true });
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return offer;
  }
}
