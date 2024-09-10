import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(createPostDto: CreatePostDto, authorUuid: string) {
    return this.postRepository.createPost(createPostDto, authorUuid);
  }

  async updatePost(updatePostDto: UpdatePostDto) {
    return this.postRepository.updatePost(updatePostDto);
  }

  async deletePost(id: number, userUuid: string) {
    return this.postRepository.deletePost(id, userUuid);
  }

  // 게시물 소유자 확인
  async validatePostOwner(postId: number, userUuid: string) {
    const post = await this.getPostById(postId);

    if (!post) {
      throw new NotFoundException('This post not found'); //Http status code : 404
    }

    if (post.authorUuid !== userUuid) {
      throw new ForbiddenException('You cannnot modify this post'); //Http status code : 403
    }
    return post;
  }

  async getAllPosts() {
    return this.postRepository.getAllPosts();
  }

  async getPostById(id: number) {
    return this.postRepository.getPostById(id);
  }

  async getPostsByTag(tagName: string) {
    return this.postRepository.getPostsByTag(tagName);
  }

  // 제목이나 본문에 특정 글자가 포함된 게시물 검색
  async searchPosts(query: string) {
    return this.postRepository.searchPosts(query);
  }
}
