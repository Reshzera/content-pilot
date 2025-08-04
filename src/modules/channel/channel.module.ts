import { Module } from '@nestjs/common';
import { InfraModule } from '@infra/infra.module';
import { ChannelController } from './controllers/channel.controller';
import { ChannelRepository } from './repositories/channel.repository';
import { ChannelService } from './services/channel.service';

@Module({
  imports: [InfraModule],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelRepository],
  exports: [ChannelService],
})
export class ChannelModule {}
