import { Field, ArgsType } from '@nestjs/graphql';

import { FetchOrdersInput } from './fetch-orders.input';

@ArgsType()
export class FetchOrdersByMasterInput extends FetchOrdersInput {
  @Field(() => [String])
  masterIds: string[];
}
