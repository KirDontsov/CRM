import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Order, OrderDocument } from './order.schema';

// запросы в монго
@Injectable()
export class OrdersRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async findOne(orderFilterQuery: FilterQuery<Order>): Promise<Order> {
    return this.orderModel.findOne(orderFilterQuery);
  }

  async find(ordersFilterQuery: FilterQuery<Order>): Promise<Order[]> {
    return this.orderModel.find(ordersFilterQuery);
  }

  async create(order: Order): Promise<Order> {
    // eslint-disable-next-line new-cap
    const newOrder = new this.orderModel(order);
    return newOrder.save();
  }

  async findOneAndUpdate(
    orderFilterQuery: FilterQuery<Order>,
    order: Partial<Order>,
  ): Promise<Order> {
    return this.orderModel.findOneAndUpdate(orderFilterQuery, order, {
      new: true,
    });
  }
}
