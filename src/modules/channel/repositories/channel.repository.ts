import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/Prisma/prisma.service';
import { Channel } from '../entities/channel.entity';
import { ReferenceVideo } from '../entities/reference-video.entity';

@Injectable()
export class ChannelRepository {
  constructor(private prisma: PrismaService) {}

  async create(channel: Channel) {
    const created = await this.prisma.channels.create({
      data: {
        name: channel.name,
        description: channel.description,
        ownerId: channel.ownerId,
      },
    });
    return Channel.PrismaToEntity(created);
  }

  async findById(id: string) {
    const channel = await this.prisma.channels.findUnique({
      where: { id },
      include: { referencesVideos: true },
    });
    return Channel.PrismaToEntity(channel);
  }

  async findUserChannels(ownerId: string) {
    const channels = await this.prisma.channels.findMany({
      where: { ownerId },
      include: { referencesVideos: true },
    });
    return channels.map((c) => Channel.PrismaToEntity(c)!);
  }

  async update(channel: Channel) {
    const updated = await this.prisma.channels.update({
      where: { id: channel.id },
      data: {
        name: channel.name,
        description: channel.description,
      },
    });
    return Channel.PrismaToEntity(updated);
  }

  async delete(id: string) {
    const deleted = await this.prisma.channels.delete({ where: { id } });
    return Channel.PrismaToEntity(deleted);
  }

  async createReference(reference: ReferenceVideo) {
    const created = await this.prisma.referencesVideos.create({
      data: {
        referenceUrl: reference.referenceUrl,
        channelId: reference.channelId,
      },
    });
    return ReferenceVideo.PrismaToEntity(created);
  }

  async findReferenceById(id: string) {
    const ref = await this.prisma.referencesVideos.findUnique({
      where: { id },
    });
    return ReferenceVideo.PrismaToEntity(ref);
  }

  async updateReference(reference: ReferenceVideo) {
    const updated = await this.prisma.referencesVideos.update({
      where: { id: reference.id },
      data: {
        referenceUrl: reference.referenceUrl,
      },
    });
    return ReferenceVideo.PrismaToEntity(updated);
  }

  async deleteReference(id: string) {
    const deleted = await this.prisma.referencesVideos.delete({
      where: { id },
    });
    return ReferenceVideo.PrismaToEntity(deleted);
  }
}
