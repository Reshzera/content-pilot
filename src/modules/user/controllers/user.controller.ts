import { IsPublic } from '@auth/decorators/is-public.decorator';
import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CreateUserDto } from '../dtos/user.create.dto';
import { UpdateUserDto } from '../dtos/user.update.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Controller({ path: 'user' })
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  @IsPublic()
  async create(@Body() user: CreateUserDto) {
    return await this.userService.create(user);
  }

  @Patch('/')
  async update(@CurrentUser() user: User, @Body() updatedUser: UpdateUserDto) {
    return await this.userService.update(user.id, updatedUser);
  }

  @Get('/me')
  async getUser(@CurrentUser() user: User) {
    return await this.userService.findById(user.id);
  }
}
