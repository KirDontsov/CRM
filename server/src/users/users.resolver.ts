import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../auth/dto/user-roles';
import { RolesGuard } from '../auth/guards/roles.guard';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { FetchUsersInput } from './dto/fetch-users.input';

// gql запросы
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => Number, { name: 'countUsers' })
  async getCount(): Promise<number> {
    return this.usersService.getCount();
  }

  // получение данных пользователя нужно при авторизации для всех ролей
  @UseGuards(JwtAuthGuard)
  @Query(() => User, { name: 'getUser' })
  findOne(@Args('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [User], { name: 'getUsers' })
  findAll(@Args() args: FetchUsersInput) {
    return this.usersService.getUsers(args);
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => User, { name: 'saveUser' })
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => User)
  deleteUser(@Args('id') id: string) {
    return this.usersService.remove(id);
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => [User])
  deleteUsers(@Args({ name: 'ids', type: () => [String] }) ids: string[]) {
    return this.usersService.removeUsers(ids);
  }
}
