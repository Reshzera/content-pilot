import { Cuts as PrismaCut, Videos as PrismaVideo } from '@prisma/client';
import { Cut, CutToApi } from './cut.entity';

export interface VideoProps {
  id?: string;
  url: string;
  status: 'processing' | 'completed';
  channelId: string;
  cuts?: Cut[];
}

export interface VideoToApi {
  id: string;
  url: string;
  status: 'processing' | 'completed';
  cuts?: CutToApi[];
}

export class Video {
  id: string;
  url: string;
  channelId: string;
  status: 'processing' | 'completed';
  cuts: Cut[];

  constructor(props: VideoProps) {
    this.id = props.id ?? '';
    this.url = props.url;
    this.channelId = props.channelId;
    this.status = props.status;
    this.cuts = props.cuts ?? [];
  }

  static PrismaToEntity(
    prismaVideo: (PrismaVideo & { cuts?: PrismaCut[] }) | null,
  ): Video | null {
    if (!prismaVideo) {
      return null;
    }

    const cuts = (prismaVideo.cuts || []).map((c) => Cut.PrismaToEntity(c)!);

    return new Video({
      id: prismaVideo.id,
      url: prismaVideo.url,
      status: prismaVideo.status as any,
      channelId: prismaVideo.channelId,
      cuts,
    });
  }

  static EntityToApi(video: Video | null): VideoToApi | null {
    if (!video) {
      return null;
    }

    return {
      id: video.id,
      url: video.url,
      status: video.status,
      cuts: video.cuts.map((c) => Cut.EntityToApi(c)!),
    };
  }
}
