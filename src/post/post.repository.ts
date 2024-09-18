import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PostRepository {
  private readonly logger = new Logger(PostRepository.name);
  constructor(private prismaService: PrismaService) {}

  async createPost(createPostDto: CreatePostDto, authorUuid: string) {
    if (!authorUuid) {
      throw new BadRequestException('authorUuid is required');
    }
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
          author: {
            connect: { uuid: authorUuid },
          },
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
          this.logger.error('createPost error1');
          this.logger.debug(error);
          throw new InternalServerErrorException('Database Error');
        }
        this.logger.error('createPost error2');
        this.logger.debug(error);
        throw new InternalServerErrorException('unknown Error');
      });
  }

  async updatePost(postId: number, updatePostDto: UpdatePostDto) {
    return this.prismaService.post
      .update({
        where: { id: postId },
        data: {
          title: updatePostDto.title,
          content: updatePostDto.content,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            this.logger.debug('Post not fonud');
            throw new NotFoundException('Post not found');
          }
          this.logger.error('updateNotice error');
          this.logger.debug(error);
          throw new InternalServerErrorException('Database Error');
        }
        this.logger.error('updateNotice known Error');
        this.logger.debug(error);
        throw new InternalServerErrorException('unkonw error');
      });
  }

  // 게시물 소유자 확인 추가하기
  async deletePost(id: number, userUuid: string) {
    return this.prismaService.post
      .update({
        where: { id, authorUuid: userUuid },
        data: {
          deletedAt: new Date(),
          authorUuid: null,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            this.logger.debug('Post not fonud');
            throw new NotFoundException('Post not found');
          }
          this.logger.error('deleteNotice error');
          this.logger.debug(error);
          throw new InternalServerErrorException('Database Error');
        }
        this.logger.error('deleteNotice known Error');
        this.logger.debug(error);
        throw new InternalServerErrorException('unknown error');
      });
  }

  async getAllPosts() {
    return this.prismaService.post
      .findMany({
        include: {
          author: false,
          tags: true,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            this.logger.debug('Post not fonud');
            throw new NotFoundException('Post not found');
          }
          this.logger.error('getAllPosts error');
          this.logger.debug(error);
          throw new InternalServerErrorException('Database Error');
        } else {
          this.logger.error('getAllPosts error');
          this.logger.debug(error);
          throw new InternalServerErrorException('unknown error');
        }
      });
  }

  async getPostById(id: number) {
    return this.prismaService.post
      .findUnique({
        where: { id },
        include: {
          author: false,
          tags: true,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            this.logger.debug('Post not fonud');
            throw new NotFoundException('Post not found');
          }
          this.logger.error('getAllPosts error');
          this.logger.debug(error);
          throw new InternalServerErrorException('Database Error');
        } else {
          this.logger.error('getAllPosts error');
          this.logger.debug(error);
          throw new InternalServerErrorException('unknown error');
        }
      });
  }

  // 특정 태그로 게시물 조회(수정 필요) -> 이건 일부는 괜찮은데 일부가 두 번 요청을 보내야 됨
  async getPostsByTag(tagName: string) {
    const tag = await this.prismaService.tag
      .findUnique({
        where: { name: tagName },
        include: {
          posts: {
            include: {
              author: false,
              tags: true,
            },
          },
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            this.logger.debug('Post not fonud');
            throw new NotFoundException('Post not found');
          }
          this.logger.error('getPostsbyTag error');
          this.logger.debug(error);
          throw new InternalServerErrorException('Database Error');
        } else {
          this.logger.error('getPostsByTag error');
          this.logger.debug(error);
          throw new InternalServerErrorException('unknown error');
        }
      });

    //??
    if (!tag) {
      throw new NotFoundException(`Tag '${tagName}' not found`);
    }
    return tag.posts;
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
        author: false,
        tags: true,
      },
    });

    return posts;
  }
}
