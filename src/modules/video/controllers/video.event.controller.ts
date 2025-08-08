import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { VideoService } from '../services/video.service';

@Controller() // sem rota HTTP
export class VideoEventsController {
  constructor(private readonly service: VideoService) {}

  @EventPattern('content-pilot-video-service.cuts-completed')
  handleCutsCompleted(@Payload() data) {
    console.log('cuts event recieved', data);
  }
}
