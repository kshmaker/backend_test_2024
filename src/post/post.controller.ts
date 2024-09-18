import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
  Patch,
  Req,
  Body,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { SearchPostDto } from './dto/searchPost.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService, //readonly는 일종의 읽기 전용
  ) {}

  //로그인 후 게시물 작성
  @UseGuards(JwtAccessTokenGuard)
  @Post('')
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
    console.log(createPostDto); //전달된 데이터 확인해보기
    console.log('Request:', req);
    return this.postService.createPost(createPostDto, req.user.userUuid);
  }

  //사용자가 게시물 수정
  @UseGuards(JwtAccessTokenGuard)
  @Patch(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    updatePostDto: UpdatePostDto,
    @Req() req,
  ) {
    console.log(updatePostDto);
    return this.postService.updatePost(id, updatePostDto, req.user.userUuid);
  }

  //사용자가 게시물 삭제
  @UseGuards(JwtAccessTokenGuard)
  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.postService.deletePost(id, req.user.userUuid);
  }

  /*
  게시물 조회
  */

  //로그인 없이 모든 게시물 조회
  @Get()
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  //로그인 없이 해당 id의 게시물 조회
  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostById(id);
  }

  //특정 문자열로 게시물 조회
  @Get('search')
  async searchPosts(@Query() searchPostDto: SearchPostDto) {
    return this.postService.searchPosts(searchPostDto.query);
  }

  @Get('tag/:tagName')
  async getPostsByTag(@Param('tagName') tagName: string) {
    return this.postService.getPostsByTag(tagName);
  }
}
