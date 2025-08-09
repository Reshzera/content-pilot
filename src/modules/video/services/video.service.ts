import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { VideoRepository } from '../repositories/video.repository';
import { Video } from '../entities/video.entity';
import { Cut } from '../entities/cut.entity';
import { ClientKafka } from '@nestjs/microservices';
import { CreateShortsCutsDto } from '../dtos/create-short-processed';
import { ChannelNotFoundError } from '../../../errors/channel.errors';

@Injectable()
export class VideoService implements OnModuleInit {
  constructor(
    private repository: VideoRepository,
    @Inject('KAFKA_CLIENT') private kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafka.connect();
  }

  async createVideoCuts(channelId: string, videoUrl: string) {
    const channel = await this.repository.findChannelById(channelId);

    if (!channel) {
      throw new ChannelNotFoundError();
    }

    const video = new Video({
      status: 'processing',
      url: videoUrl,
      channelId,
    });

    const created = (await this.repository.create(video)) as Video;

    this.kafka.emit('content-pilot.process-video', {
      videoId: created.id,
      videoUrl,
    });

    return Video.EntityToApi(created);
  }

  async addCuts(cutsEvent: CreateShortsCutsDto) {
    const videoId = cutsEvent.videoId;
    const cuts = cutsEvent.shorts;
    for (const c of cuts) {
      const cut = new Cut({
        bucketPath: c.bucketPath,
        title: c.title,
        videoId,
      });
      await this.repository.createCut(cut);
    }
  }
}
