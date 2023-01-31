import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { FilialsModule } from '../filials/filials.module';

import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { Event, EventSchema } from './mongo/event.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    FilialsModule,
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
      },
    ]),
  ],
  providers: [EventsResolver, EventsService],
})
export class EventsModule {}
