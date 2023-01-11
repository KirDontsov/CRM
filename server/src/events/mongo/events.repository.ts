import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Event, EventDocument } from './event.schema';

// запросы в монго
@Injectable()
export class EventsRepository {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async findOne(eventFilterQuery: FilterQuery<Event>): Promise<Event> {
    return this.eventModel.findOne(eventFilterQuery);
  }

  async find(eventsFilterQuery: FilterQuery<Event>): Promise<Event[]> {
    return this.eventModel.find(eventsFilterQuery);
  }

  async create(event: Event): Promise<Event> {
    // eslint-disable-next-line new-cap
    const newEvent = new this.eventModel(event);
    return newEvent.save();
  }

  async findOneAndUpdate(
    eventFilterQuery: FilterQuery<Event>,
    event: Partial<Event>,
  ): Promise<Event> {
    const existingEvent = await this.eventModel
      .findOneAndUpdate({ id: eventFilterQuery.id }, event, {
        new: true,
      })
      .exec();

    if (!existingEvent) {
      throw new NotFoundException(`Event #${event.id} not found`);
    }
    return existingEvent;
  }

  async findOneAndRemove(eventFilterQuery: FilterQuery<Event>): Promise<Event> {
    const event = await this.eventModel.findOne(eventFilterQuery);
    await this.eventModel.deleteOne(eventFilterQuery);
    return event;
  }

  async findAndRemove(eventsFilterQuery: FilterQuery<Event>): Promise<Event[]> {
    const events = await this.eventModel
      .find()
      .where('id')
      .in(eventsFilterQuery.ids)
      .exec();

    const ids = events.map(({ id }) => id);
    await this.eventModel.deleteMany({ id: { $in: ids } });
    return events;
  }
}