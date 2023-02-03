import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { UserRoles } from '../../auth/dto/user-roles';

export type UserDocument = User & Document;

// схема в монго
@Schema()
export class User {
  @Prop({ unique: true })
  id: string;

  @Prop({ type: String, enum: UserRoles, default: UserRoles.Reader })
  roles: UserRoles;

  @Prop()
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop(() => [String])
  filialIds: string[];

  @Prop({ required: true, default: () => new Date() })
  createdAt: Date;

  @Prop({ required: false, default: null })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
