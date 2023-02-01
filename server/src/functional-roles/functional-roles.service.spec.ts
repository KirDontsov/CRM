import { Test, TestingModule } from '@nestjs/testing';

import { FunctionalRolesService } from './functional-roles.service';

describe('FunctionalRolesService', () => {
  let service: FunctionalRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FunctionalRolesService],
    }).compile();

    service = module.get<FunctionalRolesService>(FunctionalRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
