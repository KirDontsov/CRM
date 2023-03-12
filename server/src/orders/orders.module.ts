import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { FilialsModule } from '../filials/filials.module';
import { UsersModule } from '../users/users.module';

import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { Order, OrderSchema } from './mongo/order.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    FilialsModule,
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
  ],
  providers: [OrdersResolver, OrdersService],
})
export class OrdersModule {}
