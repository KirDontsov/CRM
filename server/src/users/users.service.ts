import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { safeJSONParse } from '../utils';
import { FilialsService } from '../filials/filials.service';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, UserDocument } from './mongo/user.schema';
import { FetchUsersInput } from './dto/fetch-users.input';

// запросы из gql в монго
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly filialsService: FilialsService,
  ) {}

  async getCount(context): Promise<number> {
    const filialIds =
      safeJSONParse(context?.req?.headers?.filialids ?? '') ?? [];
    return this.userModel.countDocuments({ filialIds: { $in: filialIds } });
  }

  async getUserById(userFilterQuery: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(userFilterQuery);
  }

  async getUserByName(username: string): Promise<User> {
    return this.userModel.findOne({ username });
  }

  async getUsers({ limit, offset }: FetchUsersInput, ctx): Promise<User[]> {
    const filialIds = safeJSONParse(ctx?.req?.headers?.filialids ?? '') ?? [];

    return this.userModel.find({ filialIds: { $in: filialIds } }, null, {
      limit,
      skip: offset,
    });
  }

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const newUserId = uuidv4();
    const user = {
      ...createUserInput,
      id: newUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // добавляем новый id пользователя так же и в филиалы - добавление РАБОТАЕТ а удаление и замена нет!
    await Promise.all(
      createUserInput?.filialIds?.map(async (id) => {
        const filial = await this.filialsService.findOne(id);
        if (!filial) {
          throw new NotFoundException(`Filial #${filial.id} not found`);
        }
        await this.filialsService.update(id, {
          id,
          userIds: filial?.userIds?.concat(newUserId),
        });
      }),
    );

    // eslint-disable-next-line new-cap
    const newUser = await new this.userModel(user);
    return newUser.save();
  }

  async findOneAndUpdate(
    userFilterQuery: FilterQuery<User>,
    user: UpdateUserInput,
  ): Promise<User> {
    const oldUser = await this.userModel.findOne({ id: user?.id });
    const updatedUser = await this.userModel.findOneAndUpdate(
      { id: userFilterQuery.id },
      user,
      {
        new: true,
      },
    );

    if (!updatedUser) {
      throw new NotFoundException(`User #${user.id} not found`);
    }
    // TODO: разобраться как апдейтить остальные филиалы
    // if old.length > updatedLength - delete
    // if updatedLength > old.length - add
    // if updatedLength = old.length && old !== updated - replace
    await Promise.all(
      // мы проходимся по старым филиалам
      (updatedUser?.filialIds?.length >= oldUser?.filialIds?.length
        ? updatedUser?.filialIds
        : oldUser?.filialIds
      )?.map(async (id) => {
        const filial = await this.filialsService.findOne(id);
        if (!filial) {
          throw new NotFoundException(`Filial #${filial.id} not found`);
        }
        // add or delete
        if (updatedUser?.filialIds?.length > oldUser?.filialIds?.length) {
          // eslint-disable-next-line no-console
          console.log('=== ADD ===');
          await this.filialsService.update(id, {
            ...filial,
            userIds: filial.userIds.concat(updatedUser.id),
          });
        }
        if (updatedUser?.filialIds?.length < oldUser?.filialIds?.length) {
          // eslint-disable-next-line no-console
          console.log('=== DELETE ===');
          await this.filialsService.update(id, {
            ...filial,
            userIds: filial.userIds.filter(
              (userId) => userId !== updatedUser.id,
            ),
          });
        }
        // console.log('=== REPLACE ===');
        // await this.filialsService.update(id, {
        //   ...filial,
        //   userIds: filial.userIds.concat(updatedUser.id),
        // });
      }),
    );
    return updatedUser;
  }

  async findOneAndDelete(userFilterQuery: FilterQuery<User>): Promise<User> {
    const user = await this.userModel.findOne(userFilterQuery);
    await Promise.all(
      user?.filialIds?.map(async (id) => {
        const filial = await this.filialsService.findOne(id);
        if (!filial) {
          throw new NotFoundException(`Filial #${filial.id} not found`);
        }
        await this.filialsService.update(id, {
          ...filial,
          userIds: filial?.userIds?.filter((userId) => userId !== user.id),
        });
      }),
    );
    await this.userModel.deleteOne(userFilterQuery);
    return user;
  }

  async findManyAndRemove(
    usersFilterQuery: FilterQuery<User>,
  ): Promise<User[]> {
    const users = await this.userModel.find({
      id: { $in: usersFilterQuery.ids },
    });

    const ids = users.map(({ id }) => id);
    await this.userModel.deleteMany({ id: { $in: ids } });
    return users;
  }
}
