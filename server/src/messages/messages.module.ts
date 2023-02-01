import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';

import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';
import { MessageSchema, Message } from './mongo/message.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
  ],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
