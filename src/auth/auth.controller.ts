import {
  Body,
  Post,
  // Delete,
  // Request,
  // UseGuards,
  Controller,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
// import { JwtAccessTokenGuard } from './guards/accessToken.guard';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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

  //여기서만 jwtService랑 configServic를 둘 다 씀
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body);
  }

  // @UseGuards(JwtAccessTokenGuard)
  // @Delete('delete')
  // async deleteUser(@Request() req) {
  //   return this.authService.deleteUser(req.user.userId);
  // }
}
