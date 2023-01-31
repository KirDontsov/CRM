import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class FetchFilialsByOrderInput {
  @Field()
  orderId: string;
}
