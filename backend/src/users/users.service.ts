import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingService } from 'src/hashing/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hash = await this.hashingService.getHash(createUserDto.password);
    try {
      if (!createUserDto.about) delete createUserDto.about; // с фронта всегда летит пустая строка, при этом у нас есть дефолтное значение - несостыковочка...
      const user = await this.usersRepository.save({
        ...createUserDto,
        password: hash,
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError;
        if (err.code === '23505') {
          throw new ConflictException(
            'Пользователь с таким email или username уже существует',
          );
        }
      }
    }
  }

  getById(userId: number) {
    return this.usersRepository.findOneBy({ id: userId });
  }

  getByUsername(username: string, withPassword = false) {
    return this.usersRepository.findOne({
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        password: withPassword,
      },
      where: {
        username,
      },
    });
  }

  async updateOne(userId: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersRepository.findOne({
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        password: true,
      },
      where: {
        id: userId,
      },
    });
    for (const key in updateUserDto) {
      if (key === 'password') {
        const hash = await this.hashingService.getHash(updateUserDto.password);
        updatedUser[key] = hash;
      } else {
        updatedUser[key] = updateUserDto[key];
      }
    }
    try {
      const user = await this.usersRepository.save(updatedUser);
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError;
        if (err.code === '23505') {
          throw new ConflictException(
            'Пользователь с таким email или username уже существует',
          );
        }
      }
    }
  }

  findManyUsers(query: string) {
    return this.usersRepository.find({
      where: [
        {
          username: query,
        },
        {
          email: query,
        },
      ],
    });
  }

  async getMyWishes(userId: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        wishes: true,
      },
    });
    return user.wishes;
  }

  async getWishesByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: {
        username,
      },
      relations: {
        wishes: true,
        offers: true,
      },
    });
    if (!user) throw new BadRequestException('Пользователь не найден');
    return user.wishes;
  }
}
