import { InputType, Field, PartialType } from '@nestjs/graphql';

import { CreateOrderInput } from './create-order.input';
import { OrdersStatuses } from './orders-statuses';

@InputType()
export class UpdateOrderInput extends PartialType(CreateOrderInput) {
  @Field()
  id: string;

  @Field()
  status: OrdersStatuses;
}
