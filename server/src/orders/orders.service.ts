import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { OrdersRepository } from './mongo/orders.repository';
import { Order } from './mongo/order.schema';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async getOrderById(id: string): Promise<Order> {
    return this.ordersRepository.findOne({ id });
  }

  async getOrders(): Promise<Order[]> {
    return this.ordersRepository.find({});
  }

  async create(createOrderInput: CreateOrderInput) {
    const order = {
      ...createOrderInput,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      releaseDate: null,
      totalCost: `${
        Number(createOrderInput.initialCost) -
        Number(createOrderInput.sparePartsCost)
      }`,
    };
    return this.ordersRepository.create(order);
  }

  async update(id: string, orderUpdates: UpdateOrderInput): Promise<Order> {
    return this.ordersRepository.findOneAndUpdate({ id }, orderUpdates);
  }

  async remove(id: string): Promise<Order> {
    return this.ordersRepository.findOneAndRemove({ id });
  }
}
