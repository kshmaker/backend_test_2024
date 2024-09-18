import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payload } from '../dto/token.dto';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  constructor(private readonly configService: ConfigService) {
    //bearer token(JWT에서 사용)
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, //위 값을 false로 설정 시 자동으로 accessToken 만료 시 서버 에러를 리턴함.
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'), // 비밀 키
      algorithm: ['HS256'],
      passReqToCallback: false, //validate 함수의 첫번째 인자로 request 객체 전달 여부를 결정
    });
  }

  //token 발급 시 payload에는 userUuid만 넣어둠
  async validate(payload: Payload) {
    return { userUuid: payload.userUuid };
  }
}

// 이거 다시 확인하기 이거 너무 이상함
