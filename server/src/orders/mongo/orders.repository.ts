import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { FetchOrdersInput } from '../dto/fetch-orders.input';

import { Order, OrderDocument } from './order.schema';

// запросы в монго
@Injectable()
export class OrdersRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async getCount(): Promise<number> {
    return this.orderModel.countDocuments();
  }

  async findOne(orderFilterQuery: FilterQuery<Order>): Promise<Order> {
    return this.orderModel.findOne(orderFilterQuery);
  }

  async find({ limit, offset }: FetchOrdersInput): Promise<Order[]> {
    return this.orderModel.find(null, null, {
      limit,
      skip: offset,
    });
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
    const existingOrder = await this.orderModel
      .findOneAndUpdate({ id: orderFilterQuery.id }, order, {
        new: true,
      })
      .exec();

    if (!existingOrder) {
      throw new NotFoundException(`Order #${order.id} not found`);
    }
    return existingOrder;
  }

  async findOneAndRemove(orderFilterQuery: FilterQuery<Order>): Promise<Order> {
    const order = await this.orderModel.findOne(orderFilterQuery);
    await this.orderModel.deleteOne(orderFilterQuery);
    return order;
  }

  async findAndRemove(ordersFilterQuery: FilterQuery<Order>): Promise<Order[]> {
    const orders = await this.orderModel
      .find()
      .where('id')
      .in(ordersFilterQuery.ids)
      .exec();

    const ids = orders.map(({ id }) => id);
    await this.orderModel.deleteMany({ id: { $in: ids } });
    return orders;
  }
}
