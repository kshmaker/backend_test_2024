import { IsString, IsNotEmpty } from 'class-validator';

export class SearchPostDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
