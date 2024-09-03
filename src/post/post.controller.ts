import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PostService } from './post.service';
import { JwtAccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { CreatePostDto } from './dto/createPost.dto';
import { SearchPostDto } from './dto/searchPost.dto';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService, //readonly는 일종의 읽기 전용
    private readonly userService: UserService,
  ) {}

  //로그인 후 게시물 작성
  @UseGuards(JwtAccessTokenGuard)
  @Post()
  async createPost(createPostDto: CreatePostDto, authorUuid: string) {
    return this.postService.createPost(body.title, body.content, req.user.uuid);
  }

  //로그인 없이 모든 게시물 조회
  @Get()
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  //로그인 없이 해당 id의 게시물 조회
  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postService.getPostById(Number(id));
  }

  //사용자가 게시물 수정
  @UseGuards(JwtAccessTokenGuard)
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() body: { title: string; content: string },
  ) {
    return this.postService.updatePost(Number(id), body.title, body.content);
  }

  //사용자가 게시물 삭제
  @UseGuards(JwtAccessTokenGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postService.deletePost(Number(id));
  }

  @Get('search')
  async searchPosts(@Query() searchPostDto: SearchPostDto) {
    return this.postService.searchPosts(searchPostDto.query);
  }
}
