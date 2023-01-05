import { ObjectType, Field } from '@nestjs/graphql';

import { UserRoles } from '../../auth/dto/user-roles';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  roles: UserRoles;
}
