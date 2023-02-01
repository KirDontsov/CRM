import { join } from 'path';

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { EventsModule } from './events/events.module';
import { PermissionsModule } from './permissions/permissions.module';
import { FilialsModule } from './filials/filials.module';
import { FunctionalRolesModule } from './functional-roles/functional-roles.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URI),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      sortSchema: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    UsersModule,
    AuthModule,
    OrdersModule,
    EventsModule,
    PermissionsModule,
    FilialsModule,
    FunctionalRolesModule,
  ],
})
export class AppModule {}
