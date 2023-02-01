import { ObjectType, Field } from '@nestjs/graphql';

import { Filial } from '../../filials/entities/filial.entity';

@ObjectType()
export class Order {
  @Field()
  id: string;

  @Field()
  orderName: string;

  @Field(() => String)
  status: string;

  @Field({ nullable: true })
  initialPhotos: string;

  @Field()
  initialCost: string;

  @Field(() => [String])
  leftHeadlamp: string[];

  @Field(() => [String])
  rightHeadlamp: string[];

  @Field({ nullable: true })
  initialComment: string;

  @Field()
  sparePartsCost: string;

  @Field()
  totalCost: string;

  // ResolveField
  @Field(() => [Filial])
  filials: Filial[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  releaseDate: Date;
}
