import { InputType, Field, PartialType } from '@nestjs/graphql';

import { CreateFilialInput } from './create-filial.input';

@InputType()
export class UpdateFilialInput extends PartialType(CreateFilialInput) {
  @Field()
  id: string;
}
