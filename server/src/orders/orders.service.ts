import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Args } from '@nestjs/graphql';

import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { OrdersRepository } from './mongo/orders.repository';
import { Order } from './mongo/order.schema';
import { OrdersStatuses } from './dto/orders-statuses';
import { FetchOrdersInput } from './dto/fetch-orders.input';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async getCount(): Promise<number> {
    return this.ordersRepository.getCount();
  }

  async getOrderById(id: string): Promise<Order> {
    return this.ordersRepository.findOne({ id });
  }

  async getOrders(@Args() args: FetchOrdersInput): Promise<Order[]> {
    return this.ordersRepository.find(args);
  }

  async create(createOrderInput: CreateOrderInput) {
    const order = {
      ...createOrderInput,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      releaseDate: null,
      status: createOrderInput?.status
        ? createOrderInput.status
        : OrdersStatuses.Open,
      totalCost: `${
        Number(createOrderInput.initialCost) -
        Number(createOrderInput.sparePartsCost)
      }`,
    };
    return this.ordersRepository.create(order);
  }

  async update(id: string, orderUpdates: UpdateOrderInput): Promise<Order> {
    const order = {
      ...orderUpdates,
      releaseDate:
        orderUpdates?.status === OrdersStatuses.Done ? new Date() : null,
    };
    return this.ordersRepository.findOneAndUpdate({ id }, order);
  }

  async remove(id: string): Promise<Order> {
    return this.ordersRepository.findOneAndRemove({ id });
  }

  async removeOrders(ids: string[]): Promise<Order[]> {
    return this.ordersRepository.findAndRemove({ ids });
  }
}
