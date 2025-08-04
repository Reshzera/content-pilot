import { VideoService } from './video.service';
import { VideoRepository } from '../repositories/video.repository';
import { Video } from '../entities/video.entity';
import { ClientKafka } from '@nestjs/microservices';

describe('VideoService', () => {
  let service: VideoService;
  let repository: jest.Mocked<VideoRepository>;
  let kafka: jest.Mocked<ClientKafka>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      createCut: jest.fn(),
    } as any;
    kafka = {
      emit: jest.fn().mockReturnValue({ subscribe: jest.fn() } as any),
      connect: jest.fn(),
    } as any;
    service = new VideoService(repository, kafka);
  });

  it('should create video and emit processing event', async () => {
    const video = new Video({
      id: 'v1',
      title: 'processing',
      url: 'u',
      channelId: 'c1',
    });
    repository.create.mockResolvedValue(video);

    const result = await service.createVideoCuts('c1', 'u');

    expect(repository.create).toHaveBeenCalled();
    expect(kafka.emit).toHaveBeenCalledWith('process-video', {
      videoId: 'v1',
      videoUrl: 'u',
    });
    expect(result).toEqual({
      id: 'v1',
      title: 'processing',
      url: 'u',
      cuts: [],
    });
  });

  it('should save cuts when processing is completed', async () => {
    await service.addCuts('v1', [
      { url: 'cut-url', start: 1, end: 2 },
      { url: 'cut2', start: 3, end: 4 },
    ]);

    expect(repository.createCut).toHaveBeenCalledTimes(2);
    expect(repository.createCut).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        url: 'cut-url',
        startTime: 1,
        endTime: 2,
        videoId: 'v1',
      }),
    );
  });
});
