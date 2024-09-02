import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPassword } from '../validators/password.validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({ message: 'At leat 8 characters etc..' })
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
