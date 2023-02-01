import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { Event, EventDocument } from './mongo/event.schema';
import { FetchEventsInput } from './dto/fetch-events.input';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async getCount(ctx): Promise<number> {
    const userId = ctx?.req?.headers?.userid ?? '';
    return this.eventModel.countDocuments({ userId });
  }

  async getEventById(eventFilterQuery: FilterQuery<Event>): Promise<Event> {
    return this.eventModel.findOne(eventFilterQuery);
  }

  async getEventByContext(
    eventFilterQuery: FilterQuery<Event>,
    ctx,
  ): Promise<Event> {
    // нужно ли шарить события между разными пользователями?
    // если да, то нужно добавлять filialIds в сущность event и eventIds в сущность filial
    const userId = ctx?.req?.headers?.userid ?? '';
    return this.eventModel.findOne({ userId, id: eventFilterQuery.id });
  }

  async getEventsByContext(
    { limit, offset }: FetchEventsInput,
    ctx,
  ): Promise<Event[]> {
    const userId = ctx?.req?.headers?.userid ?? '';
    return this.eventModel.find({ userId }, null, {
      limit,
      skip: offset,
    });
  }

  async getEvents(
    { limit, offset }: FetchEventsInput = { offset: 0, limit: 10 },
  ): Promise<Event[]> {
    return this.eventModel.find(null, null, {
      limit,
      offset,
    });
  }

  async createEvent(createEventInput: CreateEventInput): Promise<Event> {
    const event = {
      ...createEventInput,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // eslint-disable-next-line new-cap
    const newEvent = new this.eventModel(event);
    return newEvent.save();
  }

  async findOneAndUpdate(
    eventFilterQuery: FilterQuery<Event>,
    eventInput: UpdateEventInput,
  ): Promise<Event> {
    const existingEvent = await this.eventModel.findOneAndUpdate(
      { id: eventFilterQuery.id },
      eventInput,
      {
        new: true,
      },
    );

    if (!existingEvent) {
      throw new NotFoundException(`Event #${eventInput.id} not found`);
    }
    return existingEvent;
  }

  async deleteEvent(eventFilterQuery: FilterQuery<Event>): Promise<Event> {
    const event = await this.eventModel.findOne(eventFilterQuery);
    await this.eventModel.deleteOne(eventFilterQuery);
    return event;
  }

  async deleteEvents(eventsFilterQuery: FilterQuery<Event>): Promise<Event[]> {
    const events = await this.eventModel.find({
      id: { $in: eventsFilterQuery.ids },
    });

    const ids = events.map(({ id }) => id);
    await this.eventModel.deleteMany({ id: { $in: ids } });
    return events;
  }
}
