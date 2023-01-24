import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

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
  getFilials() {
    return this.filialsService.findAll();
  }

  @Query(() => Filial)
  getFilial(@Args('id') id: string) {
    return this.filialsService.findOne(id);
  }

  @Mutation(() => Filial)
  updateFilial(
    @Args('updateFilialInput') updateFilialInput: UpdateFilialInput,
  ) {
    return this.filialsService.update(updateFilialInput.id, updateFilialInput);
  }

  @Mutation(() => Filial)
  removeFilial(@Args('id', { type: () => Int }) id: number) {
    return this.filialsService.remove(id);
  }
}
