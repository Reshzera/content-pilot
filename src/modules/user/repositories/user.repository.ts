import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/Prisma/prisma.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}
  async create(user: User) {
    const createdUser = await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
      },
    });
    return User.PrismaToEntity(createdUser);
  }
  async findByEmail(email?: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return User.PrismaToEntity(user);
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return User.PrismaToEntity(user);
  }

  async update(user: User) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
      },
    });
    return User.PrismaToEntity(updatedUser);
  }

  async delete(id: string) {
    const deletedUser = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return User.PrismaToEntity(deletedUser);
  }
}
