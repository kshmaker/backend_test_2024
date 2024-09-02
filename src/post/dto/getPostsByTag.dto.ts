import { IsString, IsNotEmpty } from 'class-validator';

export class GetPostsByTagDto {
  @IsString()
  @IsNotEmpty()
  tag: string;
}
