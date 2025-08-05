import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { randomUUID } from 'crypto';
import {
  UserInvalidCredentialsError,
  UserInvalidSessionError,
  UserNotFoundError,
} from '../../../errors/user.erros';
import { User } from '../../user/entities/user.entity';
import { UserPayload } from '../models/user.payload';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async login(user: User) {
    user.sessionId = randomUUID();

    await this.authRepository.login(user);

    const tokenPayload: UserPayload = {
      sessionId: user.sessionId,
      email: user.email,
      sub: user.id ?? '',
    };

    const token = this.jwtService.sign(tokenPayload);

    return {
      accessToken: token,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    console.log('user', user.password);

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new UserInvalidCredentialsError();
    }

    return user;
  }

  async validateSession(user: UserPayload) {
    const userWithToken = await this.authRepository.findUserById(user.sub);
    if (userWithToken?.sessionId !== user.sessionId) {
      throw new UserInvalidSessionError();
    }
  }
}
