import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field()
  eventName: string;

  @Field()
  eventType: string;

  @Field({ nullable: true })
  eventComment: string;

  @Field()
  targetDate: Date;
}
