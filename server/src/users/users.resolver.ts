import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { ExecutionContext, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../auth/dto/user-roles';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FilialsService } from '../filials/filials.service';

import { UsersService } from './users.service';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { FetchUsersInput } from './dto/fetch-users.input';

// gql запросы
@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly filialsService: FilialsService,
  ) {}

  @Query(() => Number, { name: 'countUsers' })
  async getCount(@Context() context): Promise<number> {
    return this.usersService.getCount(context);
  }

  // получение данных пользователя нужно при авторизации для всех ролей
  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  getUser(@Args('id') id: string) {
    return this.usersService.getUserById({ id });
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [User])
  getUsers(
    @Args() args: FetchUsersInput,
    @Context() context: ExecutionContext,
  ) {
    return this.usersService.getUsers(args, context);
  }

  // из контекста не берется userId
  @ResolveField()
  async filials(@Parent() user: User) {
    const { id } = user;
    return this.filialsService.findAllByUserId({ userId: id });
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => User)
  saveUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.updateUser(
      { id: updateUserInput.id },
      updateUserInput,
    );
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => User)
  deleteUser(@Args('id') id: string) {
    return this.usersService.deleteUser({ id });
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => [User])
  deleteUsers(@Args({ name: 'ids', type: () => [String] }) ids: string[]) {
    return this.usersService.deleteUsers({ ids });
  }
}
