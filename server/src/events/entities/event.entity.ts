import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Event {
  @Field()
  id: string;

  @Field()
  eventName: string;

  @Field()
  eventType: string;

  @Field({ nullable: true })
  eventComment: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  targetDate: Date;
}
