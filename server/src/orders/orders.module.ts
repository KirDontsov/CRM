import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { OrdersRepository } from './mongo/orders.repository';
import { Order, OrderSchema } from './mongo/order.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
  ],
  providers: [OrdersResolver, OrdersService, OrdersRepository],
})
export class OrdersModule {}
