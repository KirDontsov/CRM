import { Test, TestingModule } from '@nestjs/testing';

import { OrdersService } from './orders.service';
import { OrdersRepository } from './mongo/orders.repository';
import { OrdersStatuses } from './dto/orders-statuses';

const mockNewOrder = {
  id: 'b1ed7096-3a73-4e96-abbd-b2f1fab53043',
  orderName: 'Touareg NF рест',
  initialPhotos:
    'https://drive.google.com/open?id=1jtAyQDyyObHwlm-8FpN1WO1W7haudCZ6',
  initialCost: '0',
  leftHeadlamp: [],
  rightHeadlamp: ['GlassReplacementNew'],
  initialComment:
    'внутри что то гремит, убрать или закрепить. Кронштейны не ремонтируем, проверить работает ли ДХО.',
  sparePartsCost: '0',
  totalCost: '0',
  releaseDate: null,
  status: OrdersStatuses.Open,
};

const mockOrder = {
  ...mockNewOrder,
  id: 'b1ed7096-3a73-4e96-abbd-b2f1fab53042',
  __typename: 'Order',
};

const PAGING = {
  limit: 20,
  offset: 0,
};

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useFactory: () => ({
            findOne: jest.fn(() => mockOrder),
            find: jest.fn(() => [mockOrder]),
            create: jest.fn(() => mockOrder),
            findOneAndUpdate: jest.fn((id, input) => ({ ...input })),
            findOneAndRemove: jest.fn(() => null),
          }),
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should query for an order', async () => {
    const res = await service.getOrderById(mockOrder.id);
    expect(res).toEqual(expect.objectContaining(mockOrder));
  });

  it('should query all users', async () => {
    const res = await service.getOrders(PAGING);
    expect(res).toEqual([expect.objectContaining(mockOrder)]);
  });

  it('should create a user', async () => {
    const { id, ...rest } = mockNewOrder;
    const res = await service.create(rest);
    expect(res).toEqual(expect.objectContaining(mockOrder));
  });

  it('should update a user', async () => {
    const res = await service.update(mockOrder.id, {
      ...mockOrder,
      orderName: 'test2',
    });
    expect(res).toEqual(
      expect.objectContaining({ ...mockOrder, orderName: 'test2' }),
    );
  });

  it('should delete a user', async () => {
    const res = await service.remove(mockOrder.id);
    expect(res).toEqual(null);
  });
});
