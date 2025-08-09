import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { VideoService } from '../services/video.service';
import { CreateShortsCutsDto } from '../dtos/create-short-processed';

@Controller() // sem rota HTTP
export class VideoEventsController {
  constructor(private readonly service: VideoService) {}

  @EventPattern('content-pilot-video-service.cuts-completed')
  async handleCutsCompleted(@Payload() data: CreateShortsCutsDto) {
    console.log('cuts event recieved', data);
    await this.service.addCuts(data);
  }
}
