import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

// схема в монго
@Schema()
export class Message {
  @Prop({ unique: true })
  id: string;

  @Prop()
  message: string;

  @Prop()
  fromUserId: string;

  @Prop()
  toUserId: string;

  @Prop({ required: true, default: () => new Date() })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
