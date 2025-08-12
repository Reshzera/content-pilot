import { Cuts as PrismaCut } from '@prisma/client';

export interface CutProps {
  id?: string;
  title: string;
  bucketPath: string;
  videoId: string;
}

export interface CutToApi {
  id: string;
  title: string;
  url: string;
}

export class Cut {
  id: string;
  bucketPath: string;
  title: string;
  videoId: string;

  constructor(props: CutProps) {
    this.id = props.id ?? '';
    this.bucketPath = props.bucketPath;
    this.videoId = props.videoId;
    this.title = props.title;
  }

  static PrismaToEntity(prismaCut: PrismaCut | null): Cut | null {
    if (!prismaCut) {
      return null;
    }

    return new Cut({
      id: prismaCut.id,
      bucketPath: prismaCut.bucketPath,
      videoId: prismaCut.videoId,
      title: prismaCut.title,
    });
  }

  static EntityToApi(cut: Cut | null): CutToApi | null {
    if (!cut) {
      return null;
    }

    return {
      id: cut.id,
      title: cut.title,
      url: cut.bucketPath,
    };
  }
}
