import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop()
  id: string;

  @Prop()
  orderName: string;

  @Prop()
  initialPhotos: string;

  @Prop()
  initialCost: string;

  @Prop()
  leftHeadlamp: boolean;

  @Prop()
  rightHeadlamp: boolean;

  // соотнести с таблицей типов работ
  // inside the class definition
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
  // owner: Owner;
  // https://docs.nestjs.com/techniques/mongodb#model-injection
  // @Prop()
  // workType: [string];

  @Prop()
  releaseDate: Date;

  @Prop()
  initialComment: string;

  @Prop()
  spareParts: string;

  @Prop()
  totalCost: string;

  @Prop()
  createdAt: Date;

  @Prop({ required: false, default: null })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
