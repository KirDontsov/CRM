import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../auth/dto/user-roles';
import { RolesGuard } from '../auth/guards/roles.guard';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';

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

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => User, { name: 'user' })
  findOne(@Args('id') id: string) {
    return this.usersService.getUserById(id);
  }
}
