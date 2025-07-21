import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { AuthRequest } from '../models/auth.request';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    return request.user;
  },
);
