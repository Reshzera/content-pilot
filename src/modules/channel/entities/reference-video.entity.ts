import { ReferencesVideos as PrismaReference } from '@prisma/client';

export interface ReferenceVideoProps {
  id?: string;
  referenceUrl: string;
  channelId: string;
}

export interface ReferenceVideoToApi {
  id: string;
  referenceUrl: string;
}

export class ReferenceVideo {
  id: string;
  referenceUrl: string;
  channelId: string;

  constructor(props: ReferenceVideoProps) {
    this.id = props.id ?? '';
    this.referenceUrl = props.referenceUrl;
    this.channelId = props.channelId;
  }

  static PrismaToEntity(
    prismaRef: PrismaReference | null,
  ): ReferenceVideo | null {
    if (!prismaRef) {
      return null;
    }

    return new ReferenceVideo({
      id: prismaRef.id,
      referenceUrl: prismaRef.referenceUrl,
      channelId: prismaRef.channelId,
    });
  }

  static EntityToApi(ref: ReferenceVideo | null): ReferenceVideoToApi | null {
    if (!ref) {
      return null;
    }

    return {
      id: ref.id,
      referenceUrl: ref.referenceUrl,
    };
  }
}
