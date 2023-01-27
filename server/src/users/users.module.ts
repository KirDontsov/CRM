import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FilialsModule } from '../filials/filials.module';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User, UserSchema } from './mongo/user.schema';

@Module({
  imports: [
    FilialsModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
