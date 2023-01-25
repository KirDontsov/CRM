import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { UserRoles } from '../dto/user-roles';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    // у нас есть текущий пользователь
    // находим филиал относящийся к нему
    // проверяем хедеры на наличие нужного filialIds
    const queryFilialIds =
      JSON.parse(ctx.getContext()?.req?.headers?.filialids ?? '') ?? [];
    const { roles, filialIds } = ctx.getContext()?.req?.user ?? {};

    const hasRequiredFilials = filialIds?.every((filialId) =>
      queryFilialIds.includes(filialId),
    );

    const hasRequiredRoles = requiredRoles.some((role) =>
      roles?.includes(role),
    );

    return hasRequiredRoles || hasRequiredFilials;
  }
}
