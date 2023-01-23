import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Permission {
  @Field()
  id: string;

  @Field()
  value: string;
}
