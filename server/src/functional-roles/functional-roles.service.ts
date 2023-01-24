import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Args } from '@nestjs/graphql';

// import { UpdateFunctionalRoleInput } from './dto/update-functional-role.input';
import { FunctionalRolesRepository } from './mongo/functional-roles.repository';
import { CreateFunctionalRoleInput } from './dto/create-functional-role.input';
import { FetchFunctionalRolesByUserInput } from './dto/fetch-functional-roles-by-user.input';

@Injectable()
export class FunctionalRolesService {
  constructor(
    private readonly functionalRolesRepository: FunctionalRolesRepository,
  ) {}

  async create(createFunctionalRoleInput: CreateFunctionalRoleInput) {
    const functionalRole = {
      ...createFunctionalRoleInput,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.functionalRolesRepository.create(functionalRole);
  }

  findAll() {
    return `This action returns all functionalRoles`;
  }

  findAllByUserId(@Args() args: FetchFunctionalRolesByUserInput) {
    return this.functionalRolesRepository.findAllByUserId(args);
  }

  findOne(id: string) {
    return `This action returns a #${id} functionalRole`;
  }

  // updateFunctionalRoleInput: UpdateFunctionalRoleInput
  update(id: string) {
    return `This action updates a #${id} functionalRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} functionalRole`;
  }
}
