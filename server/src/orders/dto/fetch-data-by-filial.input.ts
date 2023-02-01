import { Field, ArgsType } from '@nestjs/graphql';

import { FetchOrdersInput } from './fetch-orders.input';

@ArgsType()
export class FetchDataByFilialInput extends FetchOrdersInput {
  @Field(() => [String])
  filialIds: string[];
}
