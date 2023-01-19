import { InputType, Field } from '@nestjs/graphql';

import { UserRoles } from '../../auth/dto/user-roles';

@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  roles: UserRoles;
}
