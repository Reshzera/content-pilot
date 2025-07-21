import { BadRequestException } from '@nestjs/common';

export class UserExistsError extends BadRequestException {
  constructor() {
    super('This user by email already exists.');
  }
}

export class UserNotFoundError extends BadRequestException {
  constructor() {
    super('User not found.');
  }
}

export class UserNotAuthorizedError extends BadRequestException {
  constructor() {
    super('User not authorized.');
  }
}

export class UserInvalidSessionError extends BadRequestException {
  constructor() {
    super('Invalid session.');
  }
}

export class UserTokenError extends BadRequestException {
  constructor() {
    super('Invalid token.');
  }
}

export class UserInvalidCredentialsError extends BadRequestException {
  constructor() {
    super('Invalid credentials.');
  }
}
