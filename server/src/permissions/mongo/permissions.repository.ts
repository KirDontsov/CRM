import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Permission, PermissionDocument } from './permission.schema';

@Injectable()
export class PermissionsRepository {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
  ) {}

  async find(
    permissionFilterQuery: FilterQuery<Permission>,
  ): Promise<Permission[]> {
    return this.permissionModel.find(permissionFilterQuery);
  }

  async create(permission: Permission): Promise<Permission> {
    const newPermission = new this.permissionModel(permission);
    return newPermission.save();
  }
}
