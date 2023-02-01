import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { PermissionsService } from './permissions.service';
import { PermissionsResolver } from './permissions.resolver';
import { PermissionsRepository } from './mongo/permissions.repository';
import { Permission, PermissionSchema } from './mongo/permission.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
    ]),
  ],
  providers: [PermissionsResolver, PermissionsService, PermissionsRepository],
})
export class PermissionsModule {}
