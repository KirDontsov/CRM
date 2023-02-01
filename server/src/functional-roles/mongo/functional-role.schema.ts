import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FunctionalRoleDocument = FunctionalRole & Document;

// схема в монго
@Schema()
export class FunctionalRole {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  code: string;

  @Prop()
  userIds: string[];

  @Prop()
  filialIds: string[];

  @Prop()
  permissionIds: string[];

  @Prop({ required: true, default: () => new Date() })
  createdAt: Date;

  @Prop({ required: false, default: null })
  updatedAt: Date;
}

export const FunctionalRoleSchema =
  SchemaFactory.createForClass(FunctionalRole);
