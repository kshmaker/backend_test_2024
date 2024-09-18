import {
  Body,
  Post,
  Delete,
  Controller,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
// import { JwtAccessTokenGuard } from './guards/accessToken.guard';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtRefreshTokenGuard } from './guards/refreshToken.guard';
import { JwtAccessTokenGuard } from './guards/accessToken.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  async refresh(@Req() req) {
    console.log(req.user);
    if (!req.user) {
      throw new UnauthorizedException('Incorrect refresh token');
    }
    return this.authService.refresh(req.user.userUuid);
  }

  // async refresh(@Body() body: { refreshToken: string }) {
  //   return this.authService.refresh(body);
  // }

  //회원 탈퇴
  @UseGuards(JwtAccessTokenGuard)
  @Delete('delete')
  async deleteUser(@Req() req) {
    return this.authService.deleteUser(req.user.userUuid);
  }
}
