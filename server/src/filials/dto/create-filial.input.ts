import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateFilialInput {
  @Field()
  name: string;

  @Field(() => [String])
  userIds: string[];

  @Field(() => [String])
  orderIds: string[];
}
