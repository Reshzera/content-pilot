import { IsArray, IsNotEmpty, IsString } from 'class-validator';

class Shorts {
  @IsNotEmpty()
  @IsString()
  bucketPath: string;

  @IsNotEmpty()
  @IsString()
  title: string;
}

export class CreateShortsCutsDto {
  @IsString()
  @IsNotEmpty()
  videoId: string;

  @IsArray()
  @IsNotEmpty()
  shorts: Shorts[];
}
