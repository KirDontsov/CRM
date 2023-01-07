import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { EventsRepository } from './mongo/events.repository';
import { Event, EventSchema } from './mongo/event.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
      },
    ]),
  ],
  providers: [EventsResolver, EventsService, EventsRepository],
})
export class EventsModule {}
