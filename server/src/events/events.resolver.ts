import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ExecutionContext, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../auth/dto/user-roles';
import { RolesGuard } from '../auth/guards/roles.guard';

import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { FetchEventsInput } from './dto/fetch-events.input';

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => Number)
  async countEvents(@Context() context): Promise<number> {
    return this.eventsService.getCount(context);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Event)
  getEvent(@Args('id') id: string, @Context() context) {
    return this.eventsService.getEventByContext({ id }, context);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Event])
  getEvents(@Args() args: FetchEventsInput) {
    return this.eventsService.getEvents(args);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Event])
  getEventsByUserId(
    @Args() args: FetchEventsInput,
    @Context() context: ExecutionContext,
  ) {
    return this.eventsService.getEventsByContext(args, context);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Event)
  createEvent(@Args('createEventInput') createEventInput: CreateEventInput) {
    return this.eventsService.createEvent(createEventInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Event, { name: 'saveEvent' })
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventsService.findOneAndUpdate(
      { id: updateEventInput.id },
      updateEventInput,
    );
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Event)
  deleteEvent(@Args('id') id: string) {
    return this.eventsService.deleteEvent({ id });
  }

  @Roles(UserRoles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => [Event])
  deleteEvents(@Args({ name: 'ids', type: () => [String] }) ids: string[]) {
    return this.eventsService.deleteEvents({ ids });
  }
}
