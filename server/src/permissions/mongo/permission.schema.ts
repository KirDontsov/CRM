import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PermissionDocument = Permission & Document;

// схема в монго
@Schema()
export class Permission {
  @Prop()
  id: string;

  @Prop()
  value: string;

  @Prop({ required: true, default: () => new Date() })
  createdAt: Date;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
