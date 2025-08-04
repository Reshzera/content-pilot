import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { UserModule } from './modules/user/user.module';
import { ChannelModule } from './modules/channel/channel.module';
import { VideoModule } from './modules/video/video.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    ChannelModule,
    VideoModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
