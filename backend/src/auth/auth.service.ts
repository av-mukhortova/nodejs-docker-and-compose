import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { HashingService } from 'src/hashing/hashing.service';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hashingService: HashingService,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  auth(user: User) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload, { expiresIn: '3d' }) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.getByUsername(username, true);

    if (user) {
      const isMatched = await this.hashingService.verifyHash(
        user.password,
        password,
      );
      if (isMatched) {
        return user;
      }
    }

    return null;
  }
}
