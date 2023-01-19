import { Field, Int, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class FetchEventsInput {
  @Field(() => Int)
  offset = 0;

  @Field(() => Int)
  limit = 20;
}
