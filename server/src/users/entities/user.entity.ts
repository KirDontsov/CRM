import { ObjectType, Field } from '@nestjs/graphql';

import { UserRoles } from '../../auth/dto/user-roles';
import { Filial } from '../../filials/entities/filial.entity';
import { FunctionalRole } from '../../functional-roles/entities/functional-role.entity';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  // ResolveField
  @Field(() => [Filial])
  filials: Filial[];

  // ResolveField
  @Field(() => [FunctionalRole])
  functionalRoles: FunctionalRole[];

  @Field()
  roles: UserRoles;
}
