import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FilialDocument = Filial & Document;

// схема в монго
@Schema()
export class Filial {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop(() => [String])
  userIds: string[];

  @Prop({ required: true, default: () => new Date() })
  createdAt: Date;
}

export const FilialSchema = SchemaFactory.createForClass(Filial);
