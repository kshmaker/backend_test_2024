import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/accessToken.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // 환경 변수 모듈
    PassportModule, //registerAsync를 사용하면 설정을 비동기적으로 설정할 수 있음
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        // privateKey: configService.get<string>('JWT_PRIVATE_KEY'),
        // publicKey: configService.get<string>('JWT_PUBLIC_KEY'),
        signOptions: {
          acess_expiresIn: configService.get<string>('JWT_Access_expiresIn'),
          refresh_expiresIN: configService.get<string>('JWT_Refresh_expiresIn'),
          algorithm: 'HS256',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, PrismaService],
})
export class AuthModule {}
