import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(createPostDto: CreatePostDto, authorUuid: string) {
    const { title, content, tags } = createPostDto;

    //tag 기능 추가
    let findORcreateTags = [];
    if (tags && tags.length > 0) {
    }
    //tag 기능 추가
    let findORcreateTags = [];
    if (createPostDto.tags && createPostDto.tags.length > 0) {
      //C++ 보다 낫네 map 이런 거 있으니까
      findORcreateTags = createPostDto.tags.map((tagName) => ({
        where: { name: tagName },
        create: { name: tagName },
      }));
    }
  }

  // 게시물 소유자 확인
  async validatePostOwner(postId: number, userUuid: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('This post not found'); //Http status code : 404
    }

    if (post.authorUuid !== userUuid) {
      throw new ForbiddenException('You cannnot modify this post'); //Http status code : 403
    }
    return post;
  }

  async getAllPosts() {
    return this.prisma.post.findMany({
      include: {
        author: true,
      },
    });
  }

  async getPostById(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  async updatePost(id: number, title: string, content: string) {
    return this.prisma.post.update({
      where: { id },
      data: {
        title,
        content,
      },
    });
  }

  async deletePost(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }

  // 제목이나 본문에 특정 글자가 포함된 게시물 검색
  async searchPosts(query: string) {
    const posts = await this.prisma.post.findMany({
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
