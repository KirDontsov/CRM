import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field()
  orderName: string;

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
}
