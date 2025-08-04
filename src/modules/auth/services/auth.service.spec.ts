import { AuthService } from './auth.service';
import { AuthRepository } from '../repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user/entities/user.entity';
import { UserInvalidCredentialsError, UserInvalidSessionError, UserNotFoundError } from '../../../errors/user.erros';
import { UserPayload } from '../models/user.payload';
import * as crypto from 'crypto';


describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    authRepository = {
      login: jest.fn(),
      findByEmail: jest.fn(),
      findUserById: jest.fn(),
    } as any;

    jwtService = {
      sign: jest.fn(),
    } as any;

    authService = new AuthService(authRepository, jwtService);
  });

  describe('login', () => {
    it('should set session id, store it and return access token', async () => {
      const user = new User({ email: 'test@example.com', password: '123' });
      jest.spyOn(crypto, 'randomUUID').mockReturnValue(
        '00000000-0000-0000-0000-000000000000',
      );
      jwtService.sign.mockReturnValue('token');

      const result = await authService.login(user);

      expect(user.sessionId).toBe(
        '00000000-0000-0000-0000-000000000000',
      );
      expect(authRepository.login).toHaveBeenCalledWith(user);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sessionId: '00000000-0000-0000-0000-000000000000',
        email: user.email,
        sub: user.id,
      });
      expect(result).toEqual({ accessToken: 'token' });
    });
  });

  describe('validateUser', () => {
    it('should return user when credentials match', async () => {
      const user = new User({ email: 'test@example.com', password: '123' });
      authRepository.findByEmail.mockResolvedValue(user);

      const result = await authService.validateUser('test@example.com', '123');

      expect(result).toBe(user);
    });

    it('should throw UserNotFoundError when user does not exist', async () => {
      authRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authService.validateUser('missing@example.com', '123'),
      ).rejects.toBeInstanceOf(UserNotFoundError);
    });

    it('should throw UserInvalidCredentialsError when password is invalid', async () => {
      const user = new User({ email: 'test@example.com', password: '123' });
      authRepository.findByEmail.mockResolvedValue(user);

      await expect(
        authService.validateUser('test@example.com', 'wrong'),
      ).rejects.toBeInstanceOf(UserInvalidCredentialsError);
    });
  });

  describe('validateSession', () => {
    it('should not throw when session id matches', async () => {
      const payload: UserPayload = {
        sessionId: '00000000-0000-0000-0000-000000000000',
        email: 'test@example.com',
        sub: '1',
      };
      const user = new User({
        id: '1',
        email: 'test@example.com',
        password: '123',
        sessionId: '00000000-0000-0000-0000-000000000000',
      });
      authRepository.findUserById.mockResolvedValue(user);

      await expect(authService.validateSession(payload)).resolves.toBeUndefined();
    });

    it('should throw UserInvalidSessionError when session id mismatches', async () => {
      const payload: UserPayload = {
        sessionId: 'invalid',
        email: 'test@example.com',
        sub: '1',
      };
      const user = new User({
        id: '1',
        email: 'test@example.com',
        password: '123',
        sessionId: '00000000-0000-0000-0000-000000000000',
      });
      authRepository.findUserById.mockResolvedValue(user);

      await expect(authService.validateSession(payload)).rejects.toBeInstanceOf(
        UserInvalidSessionError,
      );
    });
  });
});

