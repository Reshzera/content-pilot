import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/Prisma/prisma.service';
import { Video } from '../entities/video.entity';
import { Cut } from '../entities/cut.entity';
import { Channel } from '../../channel/entities/channel.entity';

@Injectable()
export class VideoRepository {
  constructor(private prisma: PrismaService) {}

  async create(video: Video) {
    const created = await this.prisma.videos.create({
      data: {
        status: video.status,
        url: video.url,
        channelId: video.channelId,
      },
    });
    return Video.PrismaToEntity(created);
  }

  async findVideoById(videoId: string) {
    const videoFound = await this.prisma.videos.findUnique({
      where: {
        id: videoId,
      },
    });
    return Video.PrismaToEntity(videoFound);
  }

  async updateVideo(video: Video) {
    const created = await this.prisma.videos.update({
      where: {
        id: video.id,
      },
      data: {
        status: video.status,
        url: video.url,
        channelId: video.channelId,
      },
    });
    return Video.PrismaToEntity(created);
  }

  async findChannelById(channelId: string) {
    const channel = await this.prisma.channels.findUnique({
      where: {
        id: channelId,
      },
    });

    return Channel.PrismaToEntity(channel);
  }

  async createCut(cut: Cut) {
    const created = await this.prisma.cuts.create({
      data: {
        bucketPath: cut.bucketPath,
        title: cut.title,
        videoId: cut.videoId,
      },
    });
    return Cut.PrismaToEntity(created);
  }
}
