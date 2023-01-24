import { InputType, Field, PartialType } from '@nestjs/graphql';

import { CreateFunctionalRoleInput } from './create-functional-role.input';

@InputType()
export class UpdateFunctionalRoleInput extends PartialType(
  CreateFunctionalRoleInput,
) {
  @Field()
  id: string;
}
