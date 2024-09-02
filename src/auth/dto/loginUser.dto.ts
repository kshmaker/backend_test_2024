import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
//import { IsStrongPassword } from '../validators/password.validators';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  //@IsStrongPassword({ message: 'Password must be at least 8 characters long.' })
  password: string;
}

export class TokenDto {
  @IsString()
  accesstoken: string;
  @IsString()
  refreshToken: string;
}
