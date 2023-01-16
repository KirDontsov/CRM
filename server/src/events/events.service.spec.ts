import { Test, TestingModule } from '@nestjs/testing';

import { EventsService } from './events.service';
import { EventsRepository } from './mongo/events.repository';

const mockNewEvent = {
  id: '5ca86a14-8302-414c-b5a9-178eebea9ea4',
  eventName: 'Событие на 20.01.2023',
  eventType: 'Напоминание',
  eventComment:
    'Всем привет, никто не сталкивался с такой проблемой: у меня Textarea из v4+ не хочет увеличиваться в зависимости от контента, версия 0.3.4. Контейнер у карточки grid',
  userId: '17f295e2-cda7-4e73-b02d-2af6b9237086',
  targetDate: new Date(),
};

const mockEvent = {
  ...mockNewEvent,
  id: '5ca86a14-8302-414c-b5a9-178eebea9ea3',
  __typename: 'Event',
};

const PAGING = {
  limit: 20,
  offset: 0,
};

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: EventsRepository,
          useFactory: () => ({
            findOne: jest.fn(() => mockEvent),
            find: jest.fn(() => [mockEvent]),
            findAllByUserId: jest.fn((input) => [
              { ...mockEvent, userId: input.userId },
            ]),
            create: jest.fn(() => mockEvent),
            findOneAndUpdate: jest.fn((id, input) => ({ ...input })),
            findOneAndRemove: jest.fn(() => null),
          }),
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should query for an event', async () => {
    const res = await service.getEventById(mockEvent.id);
    expect(res).toEqual(expect.objectContaining(mockEvent));
  });

  it('should query all events', async () => {
    const res = await service.getEvents(PAGING);
    expect(res).toEqual([expect.objectContaining(mockEvent)]);
  });

  it('should query all events by userId', async () => {
    const res = await service.getEventsByUserId({
      ...PAGING,
      userId: mockEvent.userId,
    });
    expect(res).toEqual([expect.objectContaining(mockEvent)]);
  });

  it('should create an event', async () => {
    const { id, ...rest } = mockNewEvent;
    const res = await service.create(rest);
    expect(res).toEqual(expect.objectContaining(mockEvent));
  });

  it('should update an event', async () => {
    const res = await service.update(mockEvent.id, {
      ...mockEvent,
      eventName: 'test2',
    });
    expect(res).toEqual(
      expect.objectContaining({ ...mockEvent, eventName: 'test2' }),
    );
  });

  it('should delete an event', async () => {
    const res = await service.remove(mockEvent.id);
    expect(res).toEqual(null);
  });
});
