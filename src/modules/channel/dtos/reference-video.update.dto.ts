import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateReferenceVideoDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  referenceUrl?: string;

  @IsOptional()
  @IsBoolean()
  delete?: boolean;
}

