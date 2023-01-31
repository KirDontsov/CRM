import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';

import { FilialsService } from './filials.service';
import { Filial } from './entities/filial.entity';
import { CreateFilialInput } from './dto/create-filial.input';
import { UpdateFilialInput } from './dto/update-filial.input';

@Resolver(() => Filial)
export class FilialsResolver {
  constructor(private readonly filialsService: FilialsService) {}

  @Mutation(() => Filial)
  createFilial(
    @Args('createFilialInput') createFilialInput: CreateFilialInput,
  ) {
    return this.filialsService.create(createFilialInput);
  }

  @Query(() => [Filial])
  getFilials(@Context() context) {
    return this.filialsService.findAllByContext(context);
  }

  @Query(() => Filial)
  getFilial(@Args('id') id: string) {
    return this.filialsService.findOne({ id });
  }

  @Mutation(() => Filial)
  updateFilial(
    @Args('updateFilialInput') updateFilialInput: UpdateFilialInput,
  ) {
    return this.filialsService.findOneAndUpdate(
      { id: updateFilialInput.id },
      updateFilialInput,
      'userIds',
    );
  }

  @Mutation(() => Filial)
  deleteFilial(@Args('id') id: string) {
    return this.filialsService.deleteFilial(id);
  }
}
