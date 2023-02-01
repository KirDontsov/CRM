import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class FetchFilialsByUserInput {
  @Field()
  userId: string;
}
