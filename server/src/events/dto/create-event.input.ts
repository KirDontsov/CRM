import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field()
  userId: string;

  @Field()
  eventName: string;

  @Field()
  eventType: string;

  @Field({ nullable: true })
  eventComment: string;

  @Field()
  targetDate: Date;
}
