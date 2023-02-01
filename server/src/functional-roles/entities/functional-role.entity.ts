import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class FunctionalRole {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  code: string;

  @Field(() => [String])
  filialIds: string[];

  @Field(() => [String])
  userIds: string[];

  @Field(() => [String])
  permissionIds: string[];
}
