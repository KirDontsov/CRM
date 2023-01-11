import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../auth/dto/user-roles';
import { RolesGuard } from '../auth/guards/roles.guard';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';

// gql запросы
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.getUsers();
  }

  // получение данных пользователя нужно при авторизации для всех ролей
  @UseGuards(JwtAuthGuard)
  @Query(() => User, { name: 'user' })
  findOne(@Args('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => User)
  removeUser(@Args('id') id: string) {
    return this.usersService.remove(id);
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => [User], { name: 'removeUsers' })
  removeUsers(@Args({ name: 'ids', type: () => [String] }) ids: string[]) {
    return this.usersService.removeUsers(ids);
  }
}
