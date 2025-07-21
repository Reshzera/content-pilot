import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserFromJwt } from '../models/user.jwt';
import { UserPayload } from '../models/user.payload';
import { AuthService } from '../services/auth.service';
import { jwtConfig } from '../constants/jwt.secret';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: UserPayload): Promise<UserFromJwt> {
    await this.authService.validateSession(payload);

    return {
      id: payload.sub,
      email: payload.email,
      sessionId: payload.sessionId,
    };
  }
}
