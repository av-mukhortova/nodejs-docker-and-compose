import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { HashingService } from 'src/hashing/hashing.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { Wish } from '../wishes/entities/wish.entity';
import { UsersModule } from 'src/users/users.module';

const { JWT_SECRET } = process.env;

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wish]),
    PassportModule,
    UsersModule,
    JwtModule.register({ secret: JWT_SECRET }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    HashingService,
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
