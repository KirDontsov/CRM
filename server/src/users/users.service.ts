import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, FilterQuery, Model } from 'mongoose';

import { FilialsService } from '../filials/filials.service';
import { hasFilialIds, safeJSONParse } from '../utils';

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
    @InjectConnection() private readonly connection: Connection,
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
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
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
            'userIds',
          );
        }),
      );
      const newUser = await new this.userModel(user);
      return await newUser.save();
    } catch (err) {
      await session.abortTransaction();
      throw new Error(err);
    } finally {
      await session.endSession();
    }
  }

  async updateUser(
    userFilterQuery: FilterQuery<User>,
    user: UpdateUserInput,
  ): Promise<User> {
    // чтобы зря не лезть в филиалы, проверяем нужно ли менять filialIds, если не нужно, просто меняем остальные поля в user
    if (hasFilialIds<UpdateUserInput>(user)) {
      const oldUser = await this.userModel.findOne({ id: user?.id });
      if (!oldUser) {
        throw new NotFoundException(`Filial #${oldUser.id} not found`);
      }
      const session = await this.connection.startSession();
      session.startTransaction();
      try {
        await Promise.all(
          // проходимся по старым или новым филиалам в зависимости от операции add/delete
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
                  'userIds',
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
                  userIds: filial.userIds.filter(
                    (userId) => userId !== user.id,
                  ),
                },
                'userIds',
              );
            }
          }),
        );
        return await this.userModel.findOneAndUpdate(
          { id: userFilterQuery.id },
          user,
          {
            new: true,
          },
        );
      } catch (err) {
        await session.abortTransaction();
        throw new Error(err);
      } finally {
        await session.endSession();
      }
    } else {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { id: userFilterQuery.id },
        user,
        {
          new: true,
        },
      );
      if (!updatedUser) {
        throw new NotFoundException(`Filial #${updatedUser.id} not found`);
      }
      return updatedUser;
    }
  }

  async deleteUser(userFilterQuery: FilterQuery<User>): Promise<User> {
    const user = await this.userModel.findOne(userFilterQuery);
    if (!user) {
      throw new NotFoundException(`User #${user.id} not found`);
    }
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
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
              'userIds',
            );
          }
        }),
      );
      await this.userModel.deleteOne(userFilterQuery);
      return user;
    } catch (err) {
      await session.abortTransaction();
      throw new Error(err);
    } finally {
      await session.endSession();
    }
  }

  async deleteUsers(usersFilterQuery: FilterQuery<User>): Promise<User[]> {
    const users = await this.userModel.find({
      id: { $in: usersFilterQuery.ids },
    });
    // сначала находим id всех филиалов и убираем дубли
    const filialIds = [...new Set(...users.map(({ filialIds: ids }) => ids))];

    const session = await this.connection.startSession();
    session.startTransaction();
    try {
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
            'userIds',
          );
        }),
      );

      await this.userModel.deleteMany({ id: { $in: usersFilterQuery.ids } });
      return users;
    } catch (err) {
      await session.abortTransaction();
      throw new Error(err);
    } finally {
      await session.endSession();
    }
  }
}
