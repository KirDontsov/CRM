import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateFunctionalRoleInput {
  @Field()
  name: string;

  @Field()
  code: string;

  @Field(() => [String])
  filialIds: string[];

  @Field(() => [String])
  permissionIds: string[];
}
