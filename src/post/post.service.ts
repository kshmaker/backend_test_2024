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
    console.log(authorUuid);
    return this.postRepository.createPost(createPostDto, authorUuid);
  }

  async updatePost(
    postId: number,
    updatePostDto: UpdatePostDto,
    userUuid: string,
  ) {
    const post = this.getPostById(postId);
    if ((await post).authorUuid == userUuid) {
      return this.postRepository.updatePost(postId, updatePostDto);
    } else {
      throw new ForbiddenException('You are not the author of this post');
    }
  }

  async deletePost(id: number, userUuid: string) {
    const deletepost = this.postRepository.getPostById(id);
    if ((await deletepost).authorUuid === userUuid) {
      return this.postRepository.deletePost(id, userUuid);
    } else {
      throw new ForbiddenException('You are not the author of this post');
    }
  }

  // 게시물 소유자 확인(근데 굳이 필요 없을 듯?) 일단 함수 만들어두긴 했는데 안 씀
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
