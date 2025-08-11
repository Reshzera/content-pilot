import { BadRequestException } from '@nestjs/common';

export class VideoNotFoundError extends BadRequestException {
  constructor() {
    super('Video not found.');
  }
}
