import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { FunctionalRolesService } from './functional-roles.service';
import { FunctionalRole } from './entities/functional-role.entity';
import { CreateFunctionalRoleInput } from './dto/create-functional-role.input';
import { UpdateFunctionalRoleInput } from './dto/update-functional-role.input';

@Resolver(() => FunctionalRole)
export class FunctionalRolesResolver {
  constructor(
    private readonly functionalRolesService: FunctionalRolesService,
  ) {}

  @Mutation(() => FunctionalRole)
  createFunctionalRole(
    @Args('createFunctionalRoleInput')
    createFunctionalRoleInput: CreateFunctionalRoleInput,
  ) {
    return this.functionalRolesService.create(createFunctionalRoleInput);
  }

  @Query(() => [FunctionalRole], { name: 'functionalRoles' })
  findAll() {
    return this.functionalRolesService.findAll();
  }

  @Query(() => FunctionalRole, { name: 'functionalRole' })
  findOne(@Args('id') id: string) {
    return this.functionalRolesService.findOne(id);
  }

  @Mutation(() => FunctionalRole)
  updateFunctionalRole(
    @Args('updateFunctionalRoleInput')
    updateFunctionalRoleInput: UpdateFunctionalRoleInput,
  ) {
    return this.functionalRolesService.update(
      updateFunctionalRoleInput.id,
      updateFunctionalRoleInput,
    );
  }

  @Mutation(() => FunctionalRole)
  removeFunctionalRole(@Args('id', { type: () => Int }) id: number) {
    return this.functionalRolesService.remove(id);
  }
}
