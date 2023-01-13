import { Test, TestingModule } from '@nestjs/testing';

import { EventsResolver } from './events.resolver';
import { EventsService } from './events.service';

describe('EventsResolver', () => {
  let resolver: EventsResolver;

  const mockService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsResolver, EventsService],
    })
      .overrideProvider(EventsService)
      .useValue(mockService)
      .compile();

    resolver = module.get<EventsResolver>(EventsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
