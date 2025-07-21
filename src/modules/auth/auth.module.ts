import { InfraModule } from '@infra/infra.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthRepository } from './repositories/auth.repository';
import { jwtConfig } from './constants/jwt.secret';

@Module({
  imports: [
    InfraModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: jwtConfig.signOptions,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
