import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/Prisma/prisma.service';
import { Video } from '../entities/video.entity';
import { Cut } from '../entities/cut.entity';

@Injectable()
export class VideoRepository {
  constructor(private prisma: PrismaService) {}

  async create(video: Video) {
    const created = await this.prisma.videos.create({
      data: {
        title: video.title,
        description: video.description,
        url: video.url,
        channelId: video.channelId,
      },
    });
    return Video.PrismaToEntity(created);
  }

  async createCut(cut: Cut) {
    const created = await this.prisma.cuts.create({
      data: {
        url: cut.url,
        startTime: cut.startTime,
        endTime: cut.endTime,
        videoId: cut.videoId,
      },
    });
    return Cut.PrismaToEntity(created);
  }
}
