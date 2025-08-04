import { Cuts as PrismaCut } from '@prisma/client';

export interface CutProps {
  id?: string;
  url: string;
  startTime: number;
  endTime: number;
  videoId: string;
}

export interface CutToApi {
  id: string;
  url: string;
  startTime: number;
  endTime: number;
}

export class Cut {
  id: string;
  url: string;
  startTime: number;
  endTime: number;
  videoId: string;

  constructor(props: CutProps) {
    this.id = props.id ?? '';
    this.url = props.url;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.videoId = props.videoId;
  }

  static PrismaToEntity(prismaCut: PrismaCut | null): Cut | null {
    if (!prismaCut) {
      return null;
    }

    return new Cut({
      id: prismaCut.id,
      url: prismaCut.url,
      startTime: prismaCut.startTime,
      endTime: prismaCut.endTime,
      videoId: prismaCut.videoId,
    });
  }

  static EntityToApi(cut: Cut | null): CutToApi | null {
    if (!cut) {
      return null;
    }

    return {
      id: cut.id,
      url: cut.url,
      startTime: cut.startTime,
      endTime: cut.endTime,
    };
  }
}
