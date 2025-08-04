import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReferenceVideoDto {
  @IsNotEmpty()
  @IsString()
  referenceUrl: string;
}
