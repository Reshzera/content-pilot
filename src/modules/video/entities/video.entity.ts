import { Cuts as PrismaCut, Videos as PrismaVideo } from '@prisma/client';
import { Cut, CutToApi } from './cut.entity';

export interface VideoProps {
  id?: string;
  title: string;
  description?: string | null;
  url: string;
  channelId: string;
  cuts?: Cut[];
}

export interface VideoToApi {
  id: string;
  title: string;
  description?: string;
  url: string;
  cuts?: CutToApi[];
}

export class Video {
  id: string;
  title: string;
  description?: string | null;
  url: string;
  channelId: string;
  cuts: Cut[];

  constructor(props: VideoProps) {
    this.id = props.id ?? '';
    this.title = props.title;
    this.description = props.description ?? null;
    this.url = props.url;
    this.channelId = props.channelId;
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
      title: prismaVideo.title,
      description: prismaVideo.description,
      url: prismaVideo.url,
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
      title: video.title,
      description: video.description ?? undefined,
      url: video.url,
      cuts: video.cuts.map((c) => Cut.EntityToApi(c)!),
    };
  }
}
