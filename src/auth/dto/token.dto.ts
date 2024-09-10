import { IsString } from 'class-validator';

export class TokenDto {
  @IsString()
  accessToken: string;
  @IsString()
  refreshToken: string;
}

export class Payload {
  @IsString()
  userUuid: string;
}
