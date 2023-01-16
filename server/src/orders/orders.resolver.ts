import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../auth/dto/user-roles';
import { RolesGuard } from '../auth/guards/roles.guard';

import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { FetchOrdersInput } from './dto/fetch-orders.input';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(() => Number, { name: 'countOrders' })
  async getCount(): Promise<number> {
    return this.ordersService.getCount();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Order, { name: 'getOrder' })
  findOne(@Args('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Order], { name: 'getOrders' })
  findAll(@Args() args: FetchOrdersInput) {
    return this.ordersService.getOrders(args);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Order, { name: 'createOrder' })
  createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput) {
    return this.ordersService.create(createOrderInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Order, { name: 'saveOrder' })
  updateOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
    return this.ordersService.update(updateOrderInput.id, updateOrderInput);
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Order)
  deleteOrder(@Args('id') id: string) {
    return this.ordersService.remove(id);
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => [Order])
  deleteOrders(@Args({ name: 'ids', type: () => [String] }) ids: string[]) {
    return this.ordersService.removeOrders(ids);
  }
}
