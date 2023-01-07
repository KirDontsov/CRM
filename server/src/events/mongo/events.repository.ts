import { Injectable } from '@nestjs/common';
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
    return this.eventModel.findOneAndUpdate(eventFilterQuery, event, {
      new: true,
    });
  }
}
