import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { UsersService } from '../users/users.service';

import { Message, MessageDocument } from './mongo/message.schema';
import { CreateMessageInput } from './dto/create-message.input';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private readonly usersService: UsersService,
  ) {}

  async createMessage(createMessageInput: CreateMessageInput) {
    const message = {
      ...createMessageInput,
      id: uuidv4(),
      createdAt: new Date(),
    };
    const newMessage = await new this.messageModel(message);
    return newMessage.save();
  }

  async findAllByUserId(createMessageInput: CreateMessageInput) {
    return this.messageModel.find({
      $or: [
        {
          toUserId: createMessageInput.toUserId,
          fromUserId: createMessageInput.fromUserId,
        },
        {
          fromUserId: createMessageInput.toUserId,
          toUserId: createMessageInput.fromUserId,
        },
      ],
    });
  }

  async findById(id: string) {
    const user = await this.usersService.getUserById({ id });
    return user;
  }
}
