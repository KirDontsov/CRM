import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/mongo/users.repository';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: UsersService, useValue: {} },
        {
          provide: UsersRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
