import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessTokenStrategy } from './strategies/accessToken.strategy';
import { JwtRefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), // 환경 변수 모듈
    PassportModule, //registerAsync를 사용하면 설정을 비동기적으로 설정할 수 있음
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          acess_expiresIn: configService.get<string>('JWT_Access_expiresIn'),
          refresh_expiresIN: configService.get<string>('JWT_Refresh_expiresIn'),
          algorithm: 'HS256',
        },
      }),
    }),
    PrismaModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    ConfigService,
    PrismaService,
    JwtService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
})
export class AuthModule {}
