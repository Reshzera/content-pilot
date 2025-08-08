import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VideoController } from './controllers/video.controller';
import { VideoService } from './services/video.service';
import { VideoRepository } from './repositories/video.repository';
import { InfraModule } from '../../infra/infra.module';
import { VideoEventsController } from './controllers/video.event.controller';

@Module({
  imports: [
    InfraModule,
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_PRODUCER_CLIENT_ID!,
            brokers: [process.env.KAFKA_BROKER!],
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
  controllers: [VideoController, VideoEventsController],
  providers: [VideoService, VideoRepository],
})
export class VideoModule {}
