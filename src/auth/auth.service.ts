import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/createUser.dto';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto /*TokenDto*/ } from './dto/loginUser.dto';
import { ApiOperation } from '@nestjs/swagger';
import { TokenDto } from './dto/token.dto';
import { AuthRepository } from './auth.repository';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly authrepository: AuthRepository,
  ) {}

  //최초의 함수는 user.service로 옮김
  @ApiOperation({ description: '회원가입' })
  async signUp(createUserDto: CreateUserDto) {
    return this.authrepository.createUser(createUserDto);
  }

  //1. 해당 이메일의 유저가 있는지
  //2. 유저가 있다면 비번이 맞는지 확인(예전에 멋모르고 local전략으로 나눠서 쓴 것)
  //3. 이 함수는 로그인 시 user가 맞는지만 확인하기 때문에 비번 유출될 일은 없음
  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findUserByEmail(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException('미가입 유저');
    }
    if (user && (await bcrypt.compare(loginUserDto.password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user; //password는 안 써서 에러 안 생기게 위의 주석 달아둠 , 스프레드 문법(ES6)
      return result;
    } else {
      throw new BadRequestException('잘못된 비밀번호 입력'); //잘못된 요청
    }
  }

  //configService 이용은 일종의 환경변수를 사용하는 방법임.-> 이걸로 env의 값들에 접근 가능
  @ApiOperation({ description: '로그인' })
  async login(loginUserDto: LoginUserDto): Promise<TokenDto> {
    const user = await this.validateUser(loginUserDto);
    if (!user) {
      throw new UnauthorizedException(
        'HTTP 401 error, 아이디 혹은 비밀번호를 다시 확인해주세요.',
      ); //HTTP status 401
    }
    const payload = { userUuid: user.uuid };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_Access_expiresIn'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_Refresh_expiresIn'),
    });

    const tokenDto: TokenDto = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    return tokenDto;
  }

  async refresh(userUuid: string) {
    const newAccessToken = this.jwtService.sign(
      { userUuid: userUuid },
      {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: this.configService.get<string>('JWT_Access_expiresIn'),
      },
    );
    return { accessToken: newAccessToken };
  }

  // async refresh(@Body() body: { refreshToken: string }) {
  //   try {
  //     const payload = this.jwtService.verify(body.refreshToken, {
  //       secret: this.configService.get<string>('JWT_SECRET_KEY'),
  //     });

  //     const accessToken = this.jwtService.sign(
  //       { userUuid: payload.userUuid },
  //       {
  //         secret: this.configService.get<string>('JWT_SECRET_KEY'),
  //         expiresIn: this.configService.get<string>('JWT_Access_expiresIn'),
  //       },
  //     );

  //     return { accessToken: accessToken };
  //   } catch {
  //     return { message: 'Expired refresh token' };
  //   }
  // }

  async deleteUser(userUuid: string) {
    return this.authrepository.deleteUser(userUuid);
  }
}
