import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

//솔직히 이 부분은 아직 잘;;
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    //bearer token(JWT에서 사용)
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //ignoreExpiration: false,
      //위 값을 false로 설정 시 자동으로 accessToken 만료 시 서버 에러를 리턴함.
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'), // 비밀 키
      algorithm: ['HS256'],
    });
  }

  //이미 따로 validate 한 거 아닌가?
  // async validate(payload: any) {
  //   return { userId: payload.sub, email: payload.email };
  // }
}

// 이거 다시 확인하기 이거 너무 이상함
