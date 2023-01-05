import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CreateOrderInput } from './dto/create-order.input';
// import { UpdateOrderInput } from './dto/update-order.input';
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
    };
    return this.ordersRepository.create(order);
  }

  // create(createOrderInput: CreateOrderInput) {
  //   return 'This action adds a new order';
  // }
  //
  // findAll() {
  //   return `This action returns all orders`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} order`;
  // }
  //
  // update(id: number, updateOrderInput: UpdateOrderInput) {
  //   return `This action updates a #${id} order`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
