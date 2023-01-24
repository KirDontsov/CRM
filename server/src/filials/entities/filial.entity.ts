import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Filial {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => [String])
  userIds: string[];
}
