import { InputType, Field, PartialType } from '@nestjs/graphql';

import { CreateEventInput } from './create-event.input';

@InputType()
export class UpdateEventInput extends PartialType(CreateEventInput) {
  @Field()
  id: string;
}
