import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../auth/dto/user-roles';
import { RolesGuard } from '../auth/guards/roles.guard';

import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => Event, { name: 'getEvent' })
  findOne(@Args('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Event], { name: 'getEvents' })
  findAll() {
    return this.eventsService.getEvents();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Event], { name: 'getEventsByUserId' })
  findAllByUser(@Args('userId') userId: string) {
    return this.eventsService.getEventsByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Event)
  createEvent(@Args('createEventInput') createEventInput: CreateEventInput) {
    return this.eventsService.create(createEventInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Event, { name: 'saveEvent' })
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventsService.update(updateEventInput.id, updateEventInput);
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Event)
  deleteEvent(@Args('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => [Event])
  deleteEvents(@Args({ name: 'ids', type: () => [String] }) ids: string[]) {
    return this.eventsService.removeEvents(ids);
  }
}
