import {
  Channels as PrismaChannel,
  ReferencesVideos as PrismaReference,
} from '@prisma/client';
import { ReferenceVideo, ReferenceVideoToApi } from './reference-video.entity';

export interface ChannelProps {
  id?: string;
  name: string;
  description?: string | null;
  ownerId: string;
  references?: ReferenceVideo[];
}

export interface ChannelToApi {
  id: string;
  name: string;
  description?: string;
  references?: ReferenceVideoToApi[];
}

export class Channel {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  references: ReferenceVideo[];

  constructor(props: ChannelProps) {
    this.id = props.id ?? '';
    this.name = props.name;
    this.description = props.description ?? null;
    this.ownerId = props.ownerId;
    this.references = props.references ?? [];
  }

  static PrismaToEntity(
    prismaChannel: (PrismaChannel & { referencesVideos?: PrismaReference[] }) | null,
  ): Channel | null {
    if (!prismaChannel) {
      return null;
    }

    const references = (prismaChannel.referencesVideos || []).map((ref) =>
      ReferenceVideo.PrismaToEntity(ref)!,
    );

    return new Channel({
      id: prismaChannel.id,
      name: prismaChannel.name,
      description: prismaChannel.description,
      ownerId: prismaChannel.ownerId,
      references,
    });
  }

  static EntityToApi(channel: Channel | null) {
    if (!channel) {
      return null;
    }

    return {
      id: channel.id,
      name: channel.name,
      description: channel.description ?? undefined,
      references: channel.references.map((r) => ReferenceVideo.EntityToApi(r)!),
    };
  }
}
