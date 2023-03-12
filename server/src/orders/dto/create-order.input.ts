import { InputType, Field } from '@nestjs/graphql';

import { OrdersStatuses } from './orders-statuses';

@InputType()
export class CreateOrderInput {
  @Field()
  orderName: string;

  @Field({ nullable: true })
  status: OrdersStatuses;

  @Field({ nullable: true })
  initialComment: string;

  @Field({ nullable: true })
  sparePartsCost: string;

  @Field({ nullable: true })
  initialPhotos: string;

  @Field()
  initialCost: string;

  @Field(() => [String], { nullable: true })
  leftHeadlamp: string[];

  @Field(() => [String], { nullable: true })
  rightHeadlamp: string[];

  @Field(() => [String])
  filialIds: string[];

  @Field(() => [String], { nullable: true })
  masterIds: string[];
}
