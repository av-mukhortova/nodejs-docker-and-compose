import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  findOne(@Req() req) {
    return this.usersService.getById(+req.user.id);
  }

  @Get('/:username')
  findOneByUsername(@Param('username') username: string) {
    return this.usersService.getByUsername(username);
  }

  @Patch('/me')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(+req.user.id, updateUserDto);
  }

  @Get('/me/wishes')
  getMyWishes(@Req() req) {
    return this.usersService.getMyWishes(+req.user.id);
  }

  @Get('/:username/wishes')
  getWishesByUsername(@Param('username') username: string) {
    return this.usersService.getWishesByUsername(username);
  }

  @Post('/find')
  findManyUsers(@Body() searchParams: { query: string }) {
    return this.usersService.findManyUsers(searchParams.query);
  }
}
