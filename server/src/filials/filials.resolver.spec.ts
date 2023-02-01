import { Test, TestingModule } from '@nestjs/testing';

import { FilialsResolver } from './filials.resolver';
import { FilialsService } from './filials.service';

describe('FilialsResolver', () => {
  let resolver: FilialsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilialsResolver, FilialsService],
    }).compile();

    resolver = module.get<FilialsResolver>(FilialsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
