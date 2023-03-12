import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field()
  fromUserId: string;

  @Field()
  toUserId: string;
}
