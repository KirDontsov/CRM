import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FilialsModule } from '../filials/filials.module';
import { FunctionalRolesModule } from '../functional-roles/functional-roles.module';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User, UserSchema } from './mongo/user.schema';
import { UsersRepository } from './mongo/users.repository';

@Module({
  imports: [
    FilialsModule,
    FunctionalRolesModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UsersResolver, UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
