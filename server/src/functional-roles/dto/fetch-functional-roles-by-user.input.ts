import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class FetchFunctionalRolesByUserInput {
  @Field()
  userId: string;
}
