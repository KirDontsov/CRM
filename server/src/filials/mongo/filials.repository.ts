import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { CreateFilialInput } from '../dto/create-filial.input';
import { FetchFilialsByUserInput } from '../dto/fetch-filials-by-user.input';

import { Filial, FilialDocument } from './filial.schema';

@Injectable()
export class FilialsRepository {
  constructor(
    @InjectModel(Filial.name)
    private filialModel: Model<FilialDocument>,
  ) {}

  async find(filialFilterQuery: FilterQuery<Filial>): Promise<Filial[]> {
    return this.filialModel.find(filialFilterQuery);
  }

  async findAllByContext(context): Promise<Filial[]> {
    const userId = context?.req?.headers?.userid ?? '';
    return this.filialModel.find({ userIds: { $eq: userId } });
  }

  async findAllByUserId({
    userId,
  }: FetchFilialsByUserInput): Promise<Filial[]> {
    const filials = await this.filialModel.find();
    return filials.filter(({ userIds }) => userIds.includes(userId)) ?? [];
  }

  async create(createFilialInput: CreateFilialInput): Promise<Filial> {
    const filial = {
      ...createFilialInput,
      id: uuidv4(),
      createdAt: new Date(),
    };
    // eslint-disable-next-line new-cap
    const newPermission = new this.filialModel(filial);
    return newPermission.save();
  }

  // TODO: findOneAndUpdate
  async findOneAndUpdate(id, filialFilterQuery: FilterQuery<Filial>) {
    return { id, filialFilterQuery };
  }
}
