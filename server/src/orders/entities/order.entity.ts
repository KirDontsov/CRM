import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Order {
  @Field()
  orderId: string;

  @Field()
  orderName: string;

  @Field()
  initialPhotos: string;

  @Field()
  initialCost: string;

  @Field()
  leftHeadlamp: boolean;

  @Field()
  rightHeadlamp: boolean;

  // соотнести с таблицей типов работ
  // inside the class definition
  // @Field({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
  // owner: Owner;
  // https://docs.nestjs.com/techniques/mongodb#model-injection
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
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
