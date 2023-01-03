import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field()
  orderName: string;

  // @Field()
  // workType: [string];

  @Field()
  releaseDate: Date;

  @Field()
  initialComment: string;

  @Field()
  spareParts: string;

  @Field()
  totalCost: string;

  @Field()
  initialPhotos: string;

  @Field()
  initialCost: string;

  @Field()
  leftHeadlamp: boolean;

  @Field()
  rightHeadlamp: boolean;
}
