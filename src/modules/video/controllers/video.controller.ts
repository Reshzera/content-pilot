import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateVideoCutsDto } from '../dtos/create-video-cuts.dto';
import { VideoService } from '../services/video.service';

@Controller({ path: 'video' })
export class VideoController {
  constructor(private service: VideoService) {}

  @Get(':id')
  async getVideoById(@Param('id') id: string) {
    return await this.service.getVideoById(id);
  }

  @Post('create-video-cuts')
  async createCuts(@Body() data: CreateVideoCutsDto) {
    return this.service.createVideoCuts(data.channelId, data.videoUrl);
  }
}
