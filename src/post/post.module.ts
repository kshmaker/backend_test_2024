import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAccessTokenStrategy } from 'src/auth/strategies/accessToken.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PostRepository } from './post.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'accessToken' }),
    ConfigModule,
    PrismaModule,
    UserModule,
  ],
  providers: [
    PostRepository,
    PostService,
    PrismaService,
    JwtService,
    JwtAccessTokenStrategy,
  ],
  controllers: [PostController],
})
export class PostModule {}
