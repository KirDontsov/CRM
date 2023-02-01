import { PartialType } from '@nestjs/mapped-types';

import { CreateMessageInput } from './create-message.input';

export class UpdateMessageDto extends PartialType(CreateMessageInput) {
  id: number;
}
