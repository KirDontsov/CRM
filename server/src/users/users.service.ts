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
    // добавляем новый id пользователя так же и в филиалы
    await Promise.all(
      createUserInput?.filialIds?.map(async (id) => {
        const filial = await this.filialsService.findOne({ id });
        if (!filial) {
          throw new NotFoundException(`Filial #${filial.id} not found`);
        }
        // т.к. это новый id, то просто добавляем его к филиалам без проверок
        await this.filialsService.findOneAndUpdate(
          { id },
          {
            id,
            userIds: filial?.userIds?.concat(newUserId),
          },
        );
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
    if (!oldUser) {
      throw new NotFoundException(`Filial #${oldUser.id} not found`);
    }
    await Promise.all(
      // мы проходимся по старым или новым филиалам в зависимости от операции add/delete
      (user?.filialIds?.length >= oldUser?.filialIds?.length
        ? user?.filialIds
        : oldUser?.filialIds
      )?.map(async (id) => {
        const filial = await this.filialsService.findOne({ id });
        if (!filial) {
          throw new NotFoundException(`Filial #${filial.id} not found`);
        }
        // ADD
        if (user?.filialIds?.length > oldUser?.filialIds?.length) {
          // если этого id еще нет в массиве. то добавляем его чтобы не дублировать
          if (filial.userIds.indexOf(user.id) === -1) {
            await this.filialsService.findOneAndUpdate(
              { id },
              {
                ...filial,
                userIds: filial.userIds.concat(user.id),
              },
            );
          }
        }
        // DELETE
        if (user?.filialIds?.length < oldUser?.filialIds?.length) {
          // если у пользователя среди его филиалов нет этого филиала, то ничего не делаем
          if (user.filialIds.indexOf(id) !== -1) return;
          await this.filialsService.findOneAndUpdate(
            { id },
            {
              ...filial,
              userIds: filial.userIds.filter((userId) => userId !== user.id),
            },
          );
        }
      }),
    );
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
    return updatedUser;
  }

  async findOneAndDelete(userFilterQuery: FilterQuery<User>): Promise<User> {
    const user = await this.userModel.findOne(userFilterQuery);
    if (!user) {
      throw new NotFoundException(`User #${user.id} not found`);
    }
    await Promise.all(
      user?.filialIds?.map(async (id) => {
        const filial = await this.filialsService.findOne({ id });
        if (!filial) {
          throw new NotFoundException(`Filial #${filial.id} not found`);
        }
        if (user.filialIds.indexOf(id) !== -1) {
          await this.filialsService.findOneAndUpdate(
            { id },
            {
              ...filial,
              userIds: filial?.userIds?.filter(
                (userId) => userId !== userFilterQuery.id,
              ),
            },
          );
        }
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
    // сначала находим id всех филиалов и убираем дубли
    const filialIds = [...new Set(...users.map(({ filialIds: ids }) => ids))];

    await Promise.all(
      filialIds?.map(async (id) => {
        const filial = await this.filialsService.findOne({ id });
        if (!filial) {
          throw new NotFoundException(`Filial #${filial.id} not found`);
        }
        // удаляем из массива userIds те id, которых нет в inpute
        await this.filialsService.findOneAndUpdate(
          { id },
          {
            ...filial,
            userIds: filial?.userIds?.filter(
              (userId) => usersFilterQuery.ids.indexOf(userId) === -1,
            ),
          },
        );
      }),
    );

    await this.userModel.deleteMany({ id: { $in: usersFilterQuery.ids } });
    return users;
  }
}
