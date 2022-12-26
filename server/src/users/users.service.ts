import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { UsersRepository } from './mongo/users.repository';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './mongo/user.schema';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserById(userId: string): Promise<User> {
    return this.usersRepository.findOne({ userId });
  }

  async getUserByName(username: string): Promise<User> {
    return this.usersRepository.findOne({ username });
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find({});
  }

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const user = {
      ...createUserInput,
      userId: uuidv4(),
    };
    return this.usersRepository.create(user);
  }

  async updateUser(
    userId: string,
    userUpdates: UpdateUserInput,
  ): Promise<User> {
    return this.usersRepository.findOneAndUpdate({ userId }, userUpdates);
  }
}
