import { IsString, IsUrl } from 'class-validator';

export class CreateVideoCutsDto {
  @IsUrl()
  videoUrl: string;

  @IsString()
  channelId: string;
}
