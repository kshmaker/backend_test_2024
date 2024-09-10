import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'accessToken' }),
    ConfigModule,
    PrismaModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, PrismaService, JwtService],
})
export class UserModule {}
