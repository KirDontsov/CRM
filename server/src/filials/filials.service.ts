import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Maybe } from 'graphql/jsutils/Maybe';

import { CreateFilialInput } from './dto/create-filial.input';
import { UpdateFilialInput } from './dto/update-filial.input';
import { FetchFilialsByUserInput } from './dto/fetch-filials-by-user.input';
import { Filial, FilialDocument } from './mongo/filial.schema';
import { FetchFilialsByOrderInput } from './dto/fetch-filials-by-order.input';

@Injectable()
export class FilialsService {
  constructor(
    @InjectModel(Filial.name) private filialModel: Model<FilialDocument>,
  ) {}

  async findOne(filialFilterQuery: FilterQuery<Filial>): Promise<Filial> {
    return this.filialModel.findOne(filialFilterQuery);
  }

  async findAllByContext(context): Promise<Filial[]> {
    const userId = context?.req?.headers?.userid ?? '';
    return this.filialModel.find({ userIds: { $eq: userId } });
  }

  async findAllByUserId({
    userId,
  }: FetchFilialsByUserInput): Promise<Filial[]> {
    const filials = await this.filialModel.find({
      userIds: userId,
    });
    return filials;
  }

  async findAllByOrderId({
    orderId,
  }: FetchFilialsByOrderInput): Promise<Filial[]> {
    const filials = await this.filialModel.find({
      orderIds: orderId,
    });
    return filials;
  }

  async create(createFilialInput: CreateFilialInput): Promise<Filial> {
    const filial = {
      ...createFilialInput,
      id: uuidv4(),
      createdAt: new Date(),
    };
    const newPermission = new this.filialModel(filial);
    return newPermission.save();
  }

  async findOneAndUpdate(
    filialFilterQuery: FilterQuery<Filial>,
    filial: UpdateFilialInput,
    type: Maybe<string>,
  ) {
    const existingFilial = await this.filialModel.findOneAndUpdate(
      { id: filialFilterQuery.id },
      type
        ? {
            $set: {
              [type]: filial[type],
            },
          }
        : filial,
      {
        new: true,
      },
    );

    if (!existingFilial) {
      throw new NotFoundException(`Filial #${filial.id} not found`);
    }
    return existingFilial;
  }

  async deleteFilial(id: string) {
    const filial = this.filialModel.findOne({ id });
    await this.filialModel.deleteOne({ id });
    return filial;
  }
}
