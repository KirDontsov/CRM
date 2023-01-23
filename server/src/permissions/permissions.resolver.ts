import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { PermissionsService } from './permissions.service';
import { Permission } from './entities/permission.entity';
import { CreatePermissionInput } from './dto/create-permission.input';

@Resolver(() => Permission)
export class PermissionsResolver {
  constructor(private readonly permissionsService: PermissionsService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Permission], { name: 'getPermissions' })
  getPermissions(@Args('userId') userId: string) {
    return this.permissionsService.getPermissions(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Permission)
  createPermission(
    @Args('createPermissionInput') createPermissionInput: CreatePermissionInput,
  ) {
    return this.permissionsService.create(createPermissionInput);
  }
}
