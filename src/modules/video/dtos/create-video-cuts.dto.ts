import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateVideoCutsDto {
  @IsUrl()
  @IsNotEmpty()
  videoUrl: string;

  @IsString()
  @IsNotEmpty()
  channelId: string;
}
