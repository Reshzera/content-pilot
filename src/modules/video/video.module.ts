import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VideoController } from './controllers/video.controller';
import { VideoService } from './services/video.service';
import { VideoRepository } from './repositories/video.repository';
import { InfraModule } from '../../infra/infra.module';

@Module({
  imports: [
    InfraModule,
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'content-pilot',
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
          },
          consumer: {
            groupId: 'content-pilot-video',
          },
        },
      },
    ]),
  ],
  controllers: [VideoController],
  providers: [VideoService, VideoRepository],
})
export class VideoModule {}
