import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CreateChannelDto } from '../dtos/channel.create.dto';
import { UpdateChannelDto } from '../dtos/channel.update.dto';
import { ChannelService } from '../services/channel.service';
import { User } from '../../user/entities/user.entity';

@Controller({ path: 'channel' })
export class ChannelController {
  constructor(private service: ChannelService) {}

  @Post()
  async create(@CurrentUser() user: User, @Body() data: CreateChannelDto) {
    return this.service.create(user.id, data);
  }

  @Get()
  async findAll(@CurrentUser() user: User) {
    return this.service.findAll(user.id);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: UpdateChannelDto,
  ) {
    return this.service.update(user.id, id, data);
  }

  @Delete(':id')
  async delete(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.delete(user.id, id);
  }
}
