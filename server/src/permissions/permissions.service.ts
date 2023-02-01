import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { PermissionsRepository } from './mongo/permissions.repository';
import { CreatePermissionInput } from './dto/create-permission.input';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  getPermissions(userId: string) {
    return this.permissionsRepository.find({ userId });
  }

  async create(createPermissionInput: CreatePermissionInput) {
    const permission = {
      ...createPermissionInput,
      id: uuidv4(),
      createdAt: new Date(),
    };
    return this.permissionsRepository.create(permission);
  }
}
