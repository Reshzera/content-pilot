import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { VideoRepository } from '../repositories/video.repository';
import { Video } from '../entities/video.entity';
import { Cut } from '../entities/cut.entity';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class VideoService implements OnModuleInit {
  constructor(
    private repository: VideoRepository,
    @Inject('KAFKA_CLIENT') private kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    const topics = ['content-pilot.process-video'];
    topics.forEach((topic) => {
      this.kafka.subscribeToResponseOf(topic);
    });
    await this.kafka.connect();
  }

  async createVideoCuts(channelId: string, videoUrl: string) {
    const video = new Video({
      title: 'processing',
      url: videoUrl,
      channelId,
    });

    const created = (await this.repository.create(video))!;

    this.kafka.emit('content-pilot.process-video', {
      videoId: created.id,
      videoUrl,
    });

    return Video.EntityToApi(created);
  }

  async addCuts(
    videoId: string,
    cuts: { url: string; start: number; end: number }[],
  ) {
    for (const c of cuts) {
      const cut = new Cut({
        url: c.url,
        startTime: c.start,
        endTime: c.end,
        videoId,
      });
      await this.repository.createCut(cut);
    }
  }
}
