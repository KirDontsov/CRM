import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { CreateFunctionalRoleInput } from '../dto/create-functional-role.input';
import { FetchFunctionalRolesByUserInput } from '../dto/fetch-functional-roles-by-user.input';

import {
  FunctionalRole,
  FunctionalRoleDocument,
} from './functional-role.schema';

@Injectable()
export class FunctionalRolesRepository {
  constructor(
    @InjectModel(FunctionalRole.name)
    private functionalRoleModel: Model<FunctionalRoleDocument>,
  ) {}

  async find(
    filialFilterQuery: FilterQuery<FunctionalRole>,
  ): Promise<FunctionalRole[]> {
    return this.functionalRoleModel.find(filialFilterQuery);
  }

  async findAllByUserId({
    userId,
  }: FetchFunctionalRolesByUserInput): Promise<FunctionalRole[]> {
    const functionalRoles = await this.functionalRoleModel.find();
    return (
      functionalRoles.filter(({ userIds }) => userIds.includes(userId)) ?? []
    );
  }

  async create(
    createFunctionalRoleInput: CreateFunctionalRoleInput,
  ): Promise<FunctionalRole> {
    const filial = {
      ...createFunctionalRoleInput,
      id: uuidv4(),
      createdAt: new Date(),
    };
    // eslint-disable-next-line new-cap
    const newPermission = new this.functionalRoleModel(filial);
    return newPermission.save();
  }
}