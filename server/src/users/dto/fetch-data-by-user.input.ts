import { Field, ArgsType } from '@nestjs/graphql';

import { FetchUsersInput } from './fetch-users.input';

@ArgsType()
export class FetchOrdersByUserInput extends FetchUsersInput {
  @Field()
  orderId: string;
}
