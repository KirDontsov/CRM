import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { EventsRepository } from './mongo/events.repository';
import { Event } from './mongo/event.schema';

@Injectable()
export class EventsService {
  constructor(private readonly eventsRepository: EventsRepository) {}

  async getEventById(id: string): Promise<Event> {
    return this.eventsRepository.findOne({ id });
  }

  async getEventsByUserId(userId: string): Promise<Event[]> {
    return this.eventsRepository.findAllByUserId({ userId });
  }

  async getEvents(): Promise<Event[]> {
    return this.eventsRepository.find({});
  }

  async create(createEventInput: CreateEventInput) {
    const event = {
      ...createEventInput,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.eventsRepository.create(event);
  }

  async update(id: string, eventUpdates: UpdateEventInput): Promise<Event> {
    return this.eventsRepository.findOneAndUpdate({ id }, eventUpdates);
  }

  async remove(id: string): Promise<Event> {
    return this.eventsRepository.findOneAndRemove({ id });
  }

  async removeEvents(ids: string[]): Promise<Event[]> {
    return this.eventsRepository.findAndRemove({ ids });
  }
}
