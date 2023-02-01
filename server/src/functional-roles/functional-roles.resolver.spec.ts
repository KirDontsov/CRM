import { Test, TestingModule } from '@nestjs/testing';

import { FunctionalRolesResolver } from './functional-roles.resolver';
import { FunctionalRolesService } from './functional-roles.service';

describe('FunctionalRolesResolver', () => {
  let resolver: FunctionalRolesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FunctionalRolesResolver, FunctionalRolesService],
    }).compile();

    resolver = module.get<FunctionalRolesResolver>(FunctionalRolesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
