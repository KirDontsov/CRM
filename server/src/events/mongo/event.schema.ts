import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop()
  id: string;

  @Prop()
  userId: string;

  @Prop()
  eventName: string;

  @Prop()
  eventType: string;

  @Prop()
  eventComment: string;

  @Prop()
  createdAt: Date;

  @Prop({ required: false, default: null })
  updatedAt: Date;

  @Prop()
  targetDate: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
