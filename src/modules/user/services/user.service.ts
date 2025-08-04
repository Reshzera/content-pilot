import { Injectable } from '@nestjs/common';
import { UserExistsError, UserNotFoundError } from '../../../errors/user.erros';
import { CreateUserDto } from '../dtos/user.create.dto';
import { UpdateUserDto } from '../dtos/user.update.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(user: CreateUserDto) {
    const userExists = await this.userRepository.findByEmail(user.email);

    if (userExists) {
      throw new UserExistsError();
    }

    const newUser = new User(user);

    const createdUser = await this.userRepository.create(newUser);

    return User.EntityToApi(createdUser);
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return User.EntityToApi(user);
  }

  async update(id: string, updatedUser: UpdateUserDto) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (updatedUser.name) {
      user.name = updatedUser.name;
    }

    if (updatedUser.email)
      if (user.email !== updatedUser.email) {
        const userExists = await this.userRepository.findByEmail(
          updatedUser.email,
        );

        if (userExists) {
          throw new UserExistsError();
        }

        user.email = updatedUser.email;
      }

    await this.userRepository.update(user);

    return User.EntityToApi(user);
  }
}
