import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FunctionalRolesService } from './functional-roles.service';
import { FunctionalRolesResolver } from './functional-roles.resolver';
import { FunctionalRolesRepository } from './mongo/functional-roles.repository';
import {
  FunctionalRole,
  FunctionalRoleSchema,
} from './mongo/functional-role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FunctionalRole.name,
        schema: FunctionalRoleSchema,
      },
    ]),
  ],
  providers: [
    FunctionalRolesResolver,
    FunctionalRolesService,
    FunctionalRolesRepository,
  ],
  exports: [FunctionalRolesService],
})
export class FunctionalRolesModule {}
