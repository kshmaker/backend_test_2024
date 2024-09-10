import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PostRepository {
  private readonly logger = new Logger(PostRepository.name);
  constructor(private prismaService: PrismaService) {}

  async createPost(createPostDto: CreatePostDto, authorUuid: string) {
    const { title, content, tags } = createPostDto;

    //tag
    let connectOrCreateTags = [];
    if (tags && tags.length > 0) {
      connectOrCreateTags = tags.map((tagName) => ({
        where: { name: tagName },
        create: { name: tagName },
      }));
    }
    return this.prismaService.post
      .create({
        data: {
          title,
          content,
          authorUuid,
          tags: { connectOrCreate: connectOrCreateTags },
        },
        include: {
          author: true,
          tags: true,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            this.logger.debug('User uuid not found');
            throw new NotFoundException('User uuid not found');
          }
          this.logger.error('createNotice error');
          this.logger.debug(error);
          throw new InternalServerErrorException('Database Error');
        }
        this.logger.error('createNotice error');
        this.logger.debug(error);
        throw new InternalServerErrorException('unknown Error');
      });
  }

  async updatePost(updatePostDto: UpdatePostDto) {
    return this.prismaService.post
      .update({
        where: { id: updatePostDto.id },
        data: {
          title: updatePostDto.title,
          content: updatePostDto.content,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          this.logger.error('updateNotice error');
          this.logger.debug(error);
          throw new InternalServerErrorException('Database Error');
        }
        this.logger.error('updateNotice known Error');
        this.logger.debug(error);
        throw new InternalServerErrorException('unkonw error');
      });
  }

  async deletePost(id: number, userUuid: string) {
    return this.prismaService.post.update({
      where: { id, authorUuid: userUuid, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // 특정 태그로 게시물 조회(수정 필요)
  async getPostsByTag(tagName: string) {
    const tag = await this.prismaService.tag.findUnique({
      where: { name: tagName },
      include: {
        posts: {
          include: {
            author: true,
            tags: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException(`Tag '${tagName}' not found`);
    }

    return tag.posts;
  }

  // 게시물 소유자 확인
  async getAllPosts() {
    return this.prismaService.post.findMany({
      include: {
        author: true,
      },
    });
  }

  async getPostById(id: number) {
    return this.prismaService.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  // 제목이나 본문에 특정 글자가 포함된 게시물 검색
  async searchPosts(query: string) {
    const posts = await this.prismaService.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive', // 대소문자 구분 없이 검색
            },
          },
          {
            content: {
              contains: query,
              mode: 'insensitive', // 대소문자 구분 없이 검색
            },
          },
        ],
      },
      include: {
        author: true,
        tags: true,
      },
    });

    return posts;
  }
}
