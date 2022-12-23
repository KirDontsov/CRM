import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { LoginUserInput } from './dto/login-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { User } from '../users/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}
  @Mutation(() => LoginResponse)
  // мидлвар проверяющий loginUserInput
  @UseGuards(GqlAuthGuard)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context,
  ) {
    return this.authService.login(context.user);
  }

  @Mutation(() => User)
  signup(@Args('loginUserInput') signupUserInput: LoginUserInput) {
    return this.authService.signup(signupUserInput);
  }
}
