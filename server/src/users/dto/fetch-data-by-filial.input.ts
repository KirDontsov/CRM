import { Field, ArgsType } from '@nestjs/graphql';

import { FetchUsersInput } from './fetch-users.input';

@ArgsType()
export class FetchDataByFilialInput extends FetchUsersInput {
  @Field(() => [String])
  filialIds: string[];
}
