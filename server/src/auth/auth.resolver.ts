import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { User } from '../users/entities/user.entity';
import { CreateUserInput } from '../users/dto/create-user.input';

import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { LoginUserInput } from './dto/login-user.input';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRoles } from './dto/user-roles';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  // мидлвар проверяющий loginUserInput
  @UseGuards(GqlAuthGuard)
  @Mutation(() => LoginResponse)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context,
  ) {
    return this.authService.login(context.user);
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => User)
  signup(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.signup(createUserInput);
  }
}
