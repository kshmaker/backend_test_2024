import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto, TokenDto } from './dto/loginUser.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  //1. 해당 이메일의 유저가 있는지
  //2. 유저가 있다면 비번이 맞는지 확인(예전에 멋모르고 local전략으로 나눠서 쓴 것)
  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.userService.findUserByEmail(loginUserDto.email);
    if (user && (await bcrypt.compare(loginUserDto.password, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    if (!user) {
      throw new UnauthorizedException('HTTP 401 error, Invalid credentials'); //HTTP status 401
    }
    const payload = { email: user.email, sub: user.uuid };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_Access_expiresIn'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_Refresh_expiresIn'),
    });

    //이것도 DTO나 type? 같은 거 써서 바꿀 수 있지 않나?
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userUuid: string, refreshToken: string) {
    const user = await this.userService.findUserByUuid(userUuid);
  }

  async deleteUser(user: User) {
    return this.prisma.user.delete({ where: { uuid: user.uuid } });
  }
}
