import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Payload } from '../dto/token.dto';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      //bearer token -> JWT 사용
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, //위 값을 false로 설정 시 자동으로 accessToken 만료 시 서버 에러를 리턴함.(어떻게 에러를 뽑는지 확인하기)
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'), //환경변수에 저장해둔 비밀
      algorithm: ['HS256'],
      passReqToCallback: false, //validate 함수의 첫번째 인자로 request 객체 전달 여부를 결정
    });
  }

  //token 발급 시 payload에는 userUuid만 넣어둠
  async validate(payload: Payload) {
    return { userUuid: payload.userUuid };
  }
}
