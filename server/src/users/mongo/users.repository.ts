import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { FetchUsersInput } from '../dto/fetch-users.input';
import { safeJSONParse } from '../../utils';

import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getCount(context): Promise<number> {
    const filialIds =
      safeJSONParse(context?.req?.headers?.filialids ?? '') ?? [];
    return this.userModel.countDocuments({ filialIds: { $in: filialIds } });
  }

  async findOne(userFilterQuery: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(userFilterQuery);
  }

  async find({ limit, offset }: FetchUsersInput, ctx): Promise<User[]> {
    const filialIds = safeJSONParse(ctx?.req?.headers?.filialids ?? '') ?? [];

    return this.userModel.find({ filialIds: { $in: filialIds } }, null, {
      limit,
      skip: offset,
    });
  }

  async create(user: User): Promise<User> {
    // eslint-disable-next-line new-cap
    const newUser = await new this.userModel(user);
    return newUser.save();
  }

  async findOneAndUpdate(
    userFilterQuery: FilterQuery<User>,
    user: Partial<User>,
  ): Promise<User> {
    const existingUser = await this.userModel.findOneAndUpdate(
      { id: userFilterQuery.id },
      user,
      {
        new: true,
      },
    );

    if (!existingUser) {
      throw new NotFoundException(`User #${user.id} not found`);
    }
    return existingUser;
  }

  async findOneAndRemove(userFilterQuery: FilterQuery<User>): Promise<User> {
    const user = await this.userModel.findOne(userFilterQuery);
    await this.userModel.deleteOne(userFilterQuery);
    return user;
  }

  async findAndRemove(usersFilterQuery: FilterQuery<User>): Promise<User[]> {
    const users = await this.userModel.find({
      id: { $in: usersFilterQuery.ids },
    });

    const ids = users.map(({ id }) => id);
    await this.userModel.deleteMany({ id: { $in: ids } });
    return users;
  }
}
