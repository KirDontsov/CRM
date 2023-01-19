import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Args } from '@nestjs/graphql';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersRepository } from './mongo/users.repository';
import { User } from './mongo/user.schema';
import { FetchUsersInput } from './dto/fetch-users.input';

// запросы из gql в монго
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getCount(): Promise<number> {
    return this.usersRepository.getCount();
  }

  async getUserById(id: string): Promise<User> {
    return this.usersRepository.findOne({ id });
  }

  async getUserByName(username: string): Promise<User> {
    return this.usersRepository.findOne({ username });
  }

  async getUsers(@Args() args: FetchUsersInput): Promise<User[]> {
    return this.usersRepository.find(args);
  }

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const user = {
      ...createUserInput,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.usersRepository.create(user);
  }

  async update(id: string, userUpdates: UpdateUserInput): Promise<User> {
    return this.usersRepository.findOneAndUpdate({ id }, userUpdates);
  }

  async remove(id: string): Promise<User> {
    return this.usersRepository.findOneAndRemove({ id });
  }

  async removeUsers(ids: string[]): Promise<User[]> {
    return this.usersRepository.findAndRemove({ ids });
  }
}
