import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
//import { IsStrongPassword } from '../validators/password.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '이메일' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '강화된 비밀번호사용할 것!' })
  @IsString()
  @IsNotEmpty()
  //@IsStrongPassword({ message: 'At leat 8 characters etc..' })
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
