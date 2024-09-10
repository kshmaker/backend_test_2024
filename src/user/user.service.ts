import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserRepository } from './user.repository';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepository: UserRepository,
  ) {}

  //password 제거해서 넘김
  async findUserByUuid({
    uuid,
  }: Pick<User, 'uuid'>): Promise<Omit<User, 'password'>> {
    return this.userRepository.findUserByUuid(uuid);
  }
}
