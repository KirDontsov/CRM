import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

// схема в монго
@Schema()
export class User {
  @Prop()
  userId: string;

  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ required: true, default: () => new Date() })
  createdAt: Date;

  @Prop({ required: false, default: null })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
