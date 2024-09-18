import {
  ConflictException,
  InternalServerErrorException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword: string = await bcrypt.hashSync(
      createUserDto.password,
      bcrypt.genSaltSync(10),
    ); //패스워드 안전하게 저장하기!(bcrypt에서 hash할 때도 방법이 다양함)

    return this.prismaService.user
      .create({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          name: createUserDto.name,
        },
      })
      .catch((error) => {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          this.logger.debug('user already exists: ${email}');
          throw new ConflictException('이미 계정이 존재합니다.');
        }
      });
  }

  async deleteUser(userUuid: string) {
    return this.prismaService.user
      .delete({ where: { uuid: userUuid } })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new NotFoundException('User not found');
          }
        } else {
          this.logger.debug('deleteUser');
          throw new InternalServerErrorException('unknown Error');
        }
      });
  }
}
