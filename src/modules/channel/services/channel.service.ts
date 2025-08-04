import { Injectable } from '@nestjs/common';
import {
  ChannelNotFoundError,
  ReferenceVideoNotFoundError,
} from '../../../errors/channel.errors';
import { CreateChannelDto } from '../dtos/channel.create.dto';
import { UpdateChannelDto } from '../dtos/channel.update.dto';
import { Channel } from '../entities/channel.entity';
import { ReferenceVideo } from '../entities/reference-video.entity';
import { ChannelRepository } from '../repositories/channel.repository';

@Injectable()
export class ChannelService {
  constructor(private repository: ChannelRepository) {}

  async create(ownerId: string, data: CreateChannelDto) {
    const channel = new Channel({
      name: data.name,
      description: data.description,
      ownerId,
    });

    const created = (await this.repository.create(channel))!;

    if (data.references?.length) {
      const promisesRefs = data.references.map((refData) => {
        const ref = new ReferenceVideo({
          channelId: created.id,
          referenceUrl: refData.referenceUrl,
        });
        return this.repository.createReference(ref) as Promise<ReferenceVideo>;
      });
      const refs = await Promise.all(promisesRefs);
      created.references = refs;
    }

    return Channel.EntityToApi(created);
  }

  async findAll(ownerId: string) {
    const channels = await this.repository.findUserChannels(ownerId);
    return channels.map((channel) => Channel.EntityToApi(channel as Channel));
  }

  async update(ownerId: string, id: string, data: UpdateChannelDto) {
    const channel = await this.repository.findById(id);

    if (!channel || channel.ownerId !== ownerId) {
      throw new ChannelNotFoundError();
    }

    if (data.name) {
      channel.name = data.name;
    }
    if (data.description !== undefined) {
      channel.description = data.description;
    }

    await this.repository.update(channel);

    if (data.references?.length) {
      for (const refData of data.references) {
        if (refData.id) {
          const existing = await this.repository.findReferenceById(refData.id);
          if (!existing || existing.channelId !== id) {
            throw new ReferenceVideoNotFoundError();
          }
          if (refData.delete) {
            await this.repository.deleteReference(existing.id);
            channel.references = channel.references.filter(
              (r) => r.id !== existing.id,
            );
          } else if (refData.referenceUrl) {
            existing.referenceUrl = refData.referenceUrl;
            await this.repository.updateReference(existing);
            const idx = channel.references.findIndex(
              (r) => r.id === existing.id,
            );
            if (idx >= 0) {
              channel.references[idx] = existing;
            }
          }
        } else if (refData.referenceUrl) {
          const ref = new ReferenceVideo({
            channelId: id,
            referenceUrl: refData.referenceUrl,
          });
          const createdRef = (await this.repository.createReference(ref))!;
          channel.references.push(createdRef);
        }
      }
    }

    return Channel.EntityToApi(channel);
  }

  async delete(ownerId: string, id: string) {
    const channel = await this.repository.findById(id);
    if (!channel || channel.ownerId !== ownerId) {
      throw new ChannelNotFoundError();
    }
    await this.repository.delete(id);
    return Channel.EntityToApi(channel);
  }
}
