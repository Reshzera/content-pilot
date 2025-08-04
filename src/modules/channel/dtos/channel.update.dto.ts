import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateReferenceVideoDto } from './reference-video.update.dto';

export class UpdateChannelDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateReferenceVideoDto)
  @IsArray()
  references?: UpdateReferenceVideoDto[];
}
