import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  //user 자체를 만드는 거라 여기에 함수를 두고, signup에서 쓰는 게 더 맞는 듯
  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword: string = await bcrypt.hashSync(
      createUserDto.password,
      bcrypt.genSaltSync(10),
    ); //패스워드 안전하게 저장하기!(bcrypt에서 hash할 때도 방법이 다양함)
    //createUserDto.password = hashedPassword;
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
      },
    });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findUserByUuid(uuid: string) {
    return this.prisma.user.findUnique({
      where: { uuid },
    });
  }
}
