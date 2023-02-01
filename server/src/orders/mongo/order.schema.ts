import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { WorkTypes } from '../dto/work-types';
import { OrdersStatuses } from '../dto/orders-statuses';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop()
  id: string;

  @Prop()
  orderName: string;

  @Prop({ type: String, enum: OrdersStatuses })
  status: string;

  @Prop()
  initialPhotos: string;

  @Prop()
  initialCost: string;

  @Prop({ type: [String], enum: WorkTypes })
  leftHeadlamp: string[];

  @Prop({ type: [String], enum: WorkTypes })
  rightHeadlamp: string[];

  @Prop()
  initialComment: string;

  @Prop()
  sparePartsCost: string;

  @Prop()
  totalCost: string;

  @Prop()
  filialIds: string[];

  @Prop()
  createdAt: Date;

  @Prop({ required: false, default: null })
  updatedAt: Date;

  @Prop({ required: false, default: null })
  releaseDate: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
