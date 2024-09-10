import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(private readonly prismaService: PrismaService) {}

  //이메일 통해서 찾은 user 정보에서 password랑 입력된 password랑 비교해야되서 user 그대로 보냄
  async findUserByEmail(email: string): Promise<User> {
    return this.prismaService.user
      .findUnique({ where: { email } })
      .catch((error) => {
        if (
          error instanceof PrismaClientKnownRequestError &&
          (error.code = 'P2025')
        ) {
          this.logger.debug('user not found: ${email}');
          throw new ForbiddenException('존재하지 않는 유저입니다.');
        }
        this.logger.error('find user by email error : ${error}');
        throw new InternalServerErrorException();
      });
  }

  //password 제거하고 출력
  async findUserByUuid(uuid: string): Promise<Omit<User, 'password'>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = await this.prismaService.user
      .findUnique({
        where: { uuid },
      })
      .catch((error) => {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          this.logger.debug('user not found : ${uuid}');
          throw new ForbiddenException('존재하지 않는 유저입니다.');
        }
        this.logger.error('find user by uuid error : ${error}');
        throw new InternalServerErrorException();
      });
    return result;
  }
}
