import { BadRequestException } from '@nestjs/common';

export class ChannelNotFoundError extends BadRequestException {
  constructor() {
    super('Channel not found.');
  }
}

export class ReferenceVideoNotFoundError extends BadRequestException {
  constructor() {
    super('Reference video not found.');
  }
}
