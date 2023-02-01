import { Field, ArgsType } from '@nestjs/graphql';

import { FetchOrdersInput } from './fetch-orders.input';

@ArgsType()
export class FetchOrdersByUserInput extends FetchOrdersInput {
  @Field()
  userId: string;
}
