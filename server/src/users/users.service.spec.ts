import { Test, TestingModule } from '@nestjs/testing';

import { UserRoles } from '../auth/dto/user-roles';

import { UsersService } from './users.service';
import { UsersRepository } from './mongo/users.repository';

const mockNewUser = {
  id: '17f295e2-cda7-4e73-b02d-2af6b9237087',
  username: 'Test',
  email: 'test',
  password: 'test',
  roles: UserRoles.Reader,
  __typename: 'User',
};

const mockUser = {
  ...mockNewUser,
  id: '17f295e2-cda7-4e73-b02d-2af6b9237086',
  __typename: 'User',
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useFactory: () => ({
            findOne: jest.fn(() => mockUser),
            find: jest.fn(() => [mockUser]),
            create: jest.fn(() => mockUser),
            findOneAndUpdate: jest.fn((id, input) => ({ ...input })),
            findOneAndRemove: jest.fn(() => null),
          }),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should query for a user', async () => {
    const res = await service.getUserById(mockUser.id);
    expect(res).toEqual(expect.objectContaining(mockUser));
  });

  it('should query all users', async () => {
    const res = await service.getUsers();
    expect(res).toEqual([expect.objectContaining(mockUser)]);
  });

  it('should create a user', async () => {
    const { id, ...rest } = mockNewUser;
    const res = await service.createUser(rest);
    expect(res).toEqual(expect.objectContaining(mockUser));
  });

  it('should update a user', async () => {
    const res = await service.update(mockUser.id, {
      ...mockUser,
      username: 'test2',
    });
    expect(res).toEqual(
      expect.objectContaining({ ...mockUser, username: 'test2' }),
    );
  });

  it('should delete a user', async () => {
    const res = await service.remove(mockUser.id);
    expect(res).toEqual(null);
  });
});
