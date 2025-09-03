import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { VideoRepository } from '../repositories/video.repository';
import { Video } from '../entities/video.entity';
import { Cut } from '../entities/cut.entity';
import { ClientKafka } from '@nestjs/microservices';
import { CreateShortsCutsDto } from '../dtos/create-short-processed';
import { ChannelNotFoundError } from '../../../errors/channel.errors';
import { VideoNotFoundError } from '../../../errors/video.errors';
import { AwsService } from '../../aws/aws.service';

@Injectable()
export class VideoService implements OnModuleInit {
  constructor(
    private repository: VideoRepository,
    private awsService: AwsService,
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

  async saveCreatedCuts(cutsEvent: CreateShortsCutsDto) {
    const videoId = cutsEvent.videoId;
    const cuts = cutsEvent.shorts;

    const video = await this.repository.findVideoById(videoId);

    if (!video) {
      throw new VideoNotFoundError();
    }

    for (const c of cuts) {
      const cut = new Cut({
        bucketPath: c.bucketPath,
        title: c.title,
        videoId,
      });
      await this.repository.createCut(cut);
    }

    video.status = 'completed';

    await this.repository.updateVideo(video);
  }
  //
  async getVideoById(videoId: string) {
    const video = await this.repository.findVideoById(videoId);

    if (!video) {
      throw new VideoNotFoundError();
    }

    const presignedUrlCutsPromise = video.cuts.map(
      async (cut) =>
        new Cut({
          ...cut,
          bucketPath: await this.awsService.getPresignedUrl(cut.bucketPath),
        }),
    );

    const presignedUrlCuts = await Promise.all(presignedUrlCutsPromise);

    video.cuts = presignedUrlCuts;

    return Video.EntityToApi(video);
  }
}
