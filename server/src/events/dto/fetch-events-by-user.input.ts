import { Field, Int, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class FetchEventsByUserInput {
  @Field()
  userId: string;

  @Field(() => Int)
  offset = 0;

  @Field(() => Int)
  limit = 20;
}
