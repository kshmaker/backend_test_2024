import { IsString } from 'class-validator';

export class TokenDto {
  @IsString()
  accessToken: string;
  @IsString()
  refreshToken: string;
}

//이런 타입 확인만 하는 경우 굳이 DTO를 쓰지 않고, Type만 쓰는게 더 낫다고도 함.(Type과 DTO의 차이점)
export class Payload {
  @IsString()
  userUuid: string;
}
