import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ForbiddenException } from '@nestjs/common';

const mockUserService = {
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findInactiveUsers: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return user if admin', async () => {
      const req = { user: { role: 'admin', userId: 99 } };
      const mockUser = { id: 1, name: 'Test' };
      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await controller.findOne(1, req);
      expect(result).toEqual(mockUser);
      expect(mockUserService.findById).toHaveBeenCalledWith(1);
    });

    it('should return user if owner', async () => {
      const req = { user: { role: 'user', userId: 1 } };
      const mockUser = { id: 1, name: 'Test' };
      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await controller.findOne(1, req);
      expect(result).toEqual(mockUser);
    });

    it('should throw Forbidden if not owner or admin', async () => {
      const req = { user: { role: 'user', userId: 2 } };

      await expect(controller.findOne(1, req)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('should call service with filters', async () => {
      const expectedUsers = [{ id: 1, name: 'John' }];
      mockUserService.findAll.mockResolvedValue(expectedUsers);

      const result = await controller.findAll('admin', 'name', 'asc');

      expect(mockUserService.findAll).toHaveBeenCalledWith({
        role: 'admin',
        sortBy: 'name',
        order: 'ASC',
      });

      expect(result).toEqual(expectedUsers);
    });
  });

  describe('update', () => {
    it('should allow user to update own data', async () => {
      const req = { user: { userId: 1 } };
      const updateData = { name: 'Updated' };
      const updatedUser = { id: 1, name: 'Updated' };

      mockUserService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(1, updateData, req);

      expect(mockUserService.update).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual(updatedUser);
    });

    it('should throw Forbidden if user tries to update another user', async () => {
      const req = { user: { userId: 2 } };

      await expect(controller.update(1, {}, req)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should call service to delete user', async () => {
      const deletedUser = { id: 1 };
      mockUserService.delete.mockResolvedValue(deletedUser);

      const result = await controller.delete(1);
      expect(mockUserService.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(deletedUser);
    });
  });

  describe('getInactiveUsers', () => {
    it('should return list of inactive users', async () => {
      const inactiveUsers = [{ id: 1, last_login: '2023-01-01' }];
      mockUserService.findInactiveUsers.mockResolvedValue(inactiveUsers);

      const result = await controller.getInactiveUsers();
      expect(result).toEqual(inactiveUsers);
      expect(mockUserService.findInactiveUsers).toHaveBeenCalled();
    });
  });
});
