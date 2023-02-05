import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, FilterQuery, Model } from 'mongoose';

import { FilialsService } from '../filials/filials.service';
import { hasFilialIds, safeJSONParse } from '../utils';
import { UsersService } from '../users/users.service';

import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { Order, OrderDocument } from './mongo/order.schema';
import { OrdersStatuses } from './dto/orders-statuses';
import { FetchOrdersInput } from './dto/fetch-orders.input';
import { FetchOrdersByMasterInput } from './dto/fetch-data-by-master.input';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly filialsService: FilialsService,
    private readonly usersService: UsersService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async getCount(context): Promise<number> {
    const filialIds =
      safeJSONParse(context?.req?.headers?.filialids ?? '') ?? [];
    return this.orderModel.countDocuments({ filialIds: { $in: filialIds } });
  }

  async getOrderById(orderFilterQuery: FilterQuery<Order>): Promise<Order> {
    return this.orderModel.findOne(orderFilterQuery);
  }

  async getOrders({ limit, offset }: FetchOrdersInput, ctx): Promise<Order[]> {
    const filialIds = safeJSONParse(ctx?.req?.headers?.filialids ?? '') ?? [];

    return this.orderModel.find({ filialIds: { $in: filialIds } }, null, {
      limit,
      skip: offset,
    });
  }

  async getOrdersByMasterId(
    { limit, offset, masterId }: FetchOrdersByMasterInput,
    ctx,
  ): Promise<Order[]> {
    const filialIds = safeJSONParse(ctx?.req?.headers?.filialids ?? '') ?? [];

    return this.orderModel.find(
      { filialIds: { $in: filialIds }, masterIds: masterId },
      null,
      {
        limit,
        skip: offset,
      },
    );
  }

  async countOrdersByMasterId(masterId: string, ctx): Promise<number> {
    const filialIds = safeJSONParse(ctx?.req?.headers?.filialids ?? '') ?? [];

    return this.orderModel.countDocuments({
      filialIds: { $in: filialIds },
      masterIds: masterId,
    });
  }

  async createOrder(createOrderInput: CreateOrderInput): Promise<Order> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const newOrderId = uuidv4();
      const order = {
        ...createOrderInput,
        id: newOrderId,
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
        masterIds: [],
      };

      // добавляем новый id пользователя так же и в филиалы
      await Promise.all(
        createOrderInput?.filialIds?.map(async (id) => {
          const filial = await this.filialsService.findOne({ id });
          if (!filial) {
            throw new NotFoundException(`Filial #${filial.id} not found`);
          }
          // т.к. это новый id, то просто добавляем его к филиалам без проверок
          await this.filialsService.findOneAndUpdate(
            { id },
            {
              id,
              orderIds: filial?.orderIds?.concat(newOrderId),
            },
            'orderIds',
          );
        }),
      );
      const newOrder = new this.orderModel(order);
      return await newOrder.save();
    } catch (err) {
      await session.abortTransaction();
      throw new Error(err);
    } finally {
      await session.endSession();
    }
  }

  async updateOrder(
    orderFilterQuery: FilterQuery<Order>,
    orderInput: UpdateOrderInput,
  ): Promise<Order> {
    const order = {
      ...orderInput,
      releaseDate:
        orderInput?.status === OrdersStatuses.Done ? new Date() : null,
    };
    // чтобы зря не лезть в филиалы, проверяем нужно ли менять filialIds, если не нужно, просто меняем остальные поля в order
    if (hasFilialIds<UpdateOrderInput>(orderInput)) {
      const oldOrder = await this.orderModel.findOne({ id: orderInput?.id });
      if (!oldOrder) {
        throw new NotFoundException(`Filial #${oldOrder.id} not found`);
      }
      const session = await this.connection.startSession();
      session.startTransaction();
      try {
        await Promise.all(
          // проходимся по старым или новым филиалам в зависимости от операции add/delete
          (orderInput?.filialIds?.length >= oldOrder?.filialIds?.length
            ? orderInput?.filialIds
            : oldOrder?.filialIds
          )?.map(async (id) => {
            const filial = await this.filialsService.findOne({ id });
            if (!filial) {
              throw new NotFoundException(`Filial #${filial.id} not found`);
            }
            // ADD
            if (orderInput?.filialIds?.length > oldOrder?.filialIds?.length) {
              // если этого id еще нет в массиве. то добавляем его чтобы не дублировать
              if (filial.orderIds.indexOf(orderInput.id) === -1) {
                await this.filialsService.findOneAndUpdate(
                  { id },
                  {
                    ...filial,
                    orderIds: filial.orderIds.concat(orderInput.id),
                  },
                  'orderIds',
                );
              }
            }
            // DELETE
            if (orderInput?.filialIds?.length < oldOrder?.filialIds?.length) {
              // если у пользователя среди его филиалов нет этого филиала, то ничего не делаем
              if (orderInput.filialIds.indexOf(id) !== -1) return;
              await this.filialsService.findOneAndUpdate(
                { id },
                {
                  ...filial,
                  orderIds: filial.orderIds.filter(
                    (userId) => userId !== orderInput.id,
                  ),
                },
                'orderIds',
              );
            }
          }),
        );

        return await this.orderModel.findOneAndUpdate(
          { id: orderFilterQuery.id },
          order,
          {
            new: true,
          },
        );
      } catch (err) {
        await session.abortTransaction();
        throw new Error(err);
      } finally {
        await session.endSession();
      }
    } else {
      const updatedOrder = await this.orderModel.findOneAndUpdate(
        { id: orderFilterQuery.id },
        order,
        {
          new: true,
        },
      );
      if (!updatedOrder) {
        throw new NotFoundException(`Filial #${updatedOrder.id} not found`);
      }
      return updatedOrder;
    }
  }

  async deleteOrder(orderFilterQuery: FilterQuery<Order>): Promise<Order> {
    const order = await this.orderModel.findOne(orderFilterQuery);
    if (!order) {
      throw new NotFoundException(`User #${order.id} not found`);
    }
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await Promise.all(
        order?.filialIds?.map(async (id) => {
          const filial = await this.filialsService.findOne({ id });
          if (!filial) {
            throw new NotFoundException(`Filial #${filial.id} not found`);
          }
          if (order.filialIds.indexOf(id) !== -1) {
            await this.filialsService.findOneAndUpdate(
              { id },
              {
                ...filial,
                orderIds: filial?.orderIds?.filter(
                  (userId) => userId !== orderFilterQuery.id,
                ),
              },
              'orderIds',
            );
          }
        }),
      );

      await this.orderModel.deleteOne(orderFilterQuery);
      return order;
    } catch (err) {
      await session.abortTransaction();
      throw new Error(err);
    } finally {
      await session.endSession();
    }
  }

  async deleteOrders(ordersFilterQuery: FilterQuery<Order>): Promise<Order[]> {
    const orders = await this.orderModel.find({
      id: { $in: ordersFilterQuery.ids },
    });
    // сначала находим id всех филиалов и убираем дубли
    const filialIds = [...new Set(...orders.map(({ filialIds: ids }) => ids))];
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await Promise.all(
        filialIds?.map(async (id) => {
          const filial = await this.filialsService.findOne({ id });
          if (!filial) {
            throw new NotFoundException(`Filial #${filial.id} not found`);
          }
          // удаляем из массива orderIds те id, которых нет в inpute
          await this.filialsService.findOneAndUpdate(
            { id },
            {
              ...filial,
              orderIds: filial?.orderIds?.filter(
                (userId) => ordersFilterQuery.ids.indexOf(userId) === -1,
              ),
            },
            'orderIds',
          );
        }),
      );

      await this.orderModel.deleteMany({ id: { $in: ordersFilterQuery.ids } });
      return orders;
    } catch (err) {
      await session.abortTransaction();
      throw new Error(err);
    } finally {
      await session.endSession();
    }
  }
}
