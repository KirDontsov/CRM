import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../auth/dto/user-roles';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FilialsService } from '../filials/filials.service';

import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { FetchOrdersInput } from './dto/fetch-orders.input';
import { FetchOrdersByMasterInput } from './dto/fetch-data-by-master.input';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly filialsService: FilialsService,
  ) {}

  @Query(() => Number, { name: 'countOrders' })
  async getCount(@Context() context): Promise<number> {
    return this.ordersService.getCount(context);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Order)
  getOrder(@Args('id') id: string) {
    return this.ordersService.getOrderById({ id });
  }

  @ResolveField()
  async filials(@Parent() order: Order) {
    const { id } = order;
    return this.filialsService.findAllByOrderId({ orderId: id });
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Order])
  getOrders(@Args() args: FetchOrdersInput, @Context() context) {
    return this.ordersService.getOrders(args, context);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Order])
  getOrdersByMasterId(
    @Args() args: FetchOrdersByMasterInput,
    @Context() context,
  ) {
    return this.ordersService.getOrdersByMasterId(args, context);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Number)
  countOrdersByMasterId(
    @Args('masterIds', { type: () => [String] }) masterIds: string[],
    @Context() context,
  ) {
    return this.ordersService.countOrdersByMasterId(masterIds, context);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Order, { name: 'createOrder' })
  createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput) {
    return this.ordersService.createOrder(createOrderInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Order, { name: 'saveOrder' })
  updateOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
    return this.ordersService.updateOrder(
      { id: updateOrderInput.id },
      updateOrderInput,
    );
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Order)
  deleteOrder(@Args('id') id: string) {
    return this.ordersService.deleteOrder({ id });
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => [Order])
  deleteOrders(@Args({ name: 'ids', type: () => [String] }) ids: string[]) {
    return this.ordersService.deleteOrders({ ids });
  }
}
