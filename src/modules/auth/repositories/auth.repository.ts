import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/Prisma/prisma.service';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return User.PrismaToEntity(user);
  }

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return User.PrismaToEntity(user);
  }

  async login(user: User) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        sessionId: user.sessionId,
      },
    });
    return User.PrismaToEntity(updatedUser);
  }

  async createUser(user: User) {
    const createdUser = await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
      },
    });
    return User.PrismaToEntity(createdUser);
  }

  async logout(user: User) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        sessionId: null,
      },
    });
    return User.PrismaToEntity(updatedUser);
  }
}
