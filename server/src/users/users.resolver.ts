import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../auth/dto/user-roles';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FilialsService } from '../filials/filials.service';
import { FunctionalRolesService } from '../functional-roles/functional-roles.service';

import { UsersService } from './users.service';
import { UpdateUserInput } from './dto/update-user.input';
import { FetchUsersInput } from './dto/fetch-users.input';
import { User } from './entities/user.entity';

// gql запросы
@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly filialsService: FilialsService,
    private readonly functionalRolesService: FunctionalRolesService,
  ) {}

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

  @ResolveField()
  async filials(@Parent() user: User) {
    const { id } = user;
    return this.filialsService.findAllByUserId({ userId: id });
  }

  @ResolveField()
  async functionalRoles(@Parent() user: User) {
    const { id } = user;
    return this.functionalRolesService.findAllByUserId({ userId: id });
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
