import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

const mockUserArray: User[] = [
  { id: 1, name: 'John', email: 'john@example.com', password: 'hashed', role: 'user', created_at: new Date(), update_at: new Date(), last_login: new Date() },
  { id: 2, name: 'Jane', email: 'jane@example.com', password: 'hashed', role: 'admin', created_at: new Date(), update_at: new Date(), last_login: new Date() },
];

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all users with filters', async () => {
    mockRepo.find.mockResolvedValue(mockUserArray);

    const result = await service.findAll({ role: 'user', sortBy: 'name', order: 'ASC' });

    expect(mockRepo.find).toHaveBeenCalledWith({
      where: { role: 'user' },
      order: { name: 'ASC' },
    });

    expect(result).toEqual(mockUserArray);
  });

  it('should create user and hash password', async () => {
    const data = { name: 'Test', email: 'test@example.com', password: '123' };
    const hashedPassword = 'hashed123';

    mockRepo.create.mockReturnValue(data);
    jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
    mockRepo.save.mockResolvedValue({ ...data, password: hashedPassword });

    const result = await service.create(data);

    expect(result.password).toBe(hashedPassword);
    expect(mockRepo.create).toHaveBeenCalledWith(data);
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('should update user by ID', async () => {
    const updatedUser = { ...mockUserArray[0], name: 'Updated' };

    mockRepo.update.mockResolvedValue(undefined);
    mockRepo.findOneOrFail.mockResolvedValue(updatedUser);

    const result = await service.update(1, { name: 'Updated' });

    expect(result).toEqual(updatedUser);
    expect(mockRepo.update).toHaveBeenCalledWith(1, { name: 'Updated' });
  });

  it('should throw if user not found when deleting', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(service.delete(99)).rejects.toThrow(NotFoundException);
  });

  it('should delete user if found', async () => {
    const user = mockUserArray[0];
    mockRepo.findOne.mockResolvedValue(user);
    mockRepo.delete.mockResolvedValue(undefined);

    const result = await service.delete(user.id);

    expect(mockRepo.delete).toHaveBeenCalledWith(user.id);
    expect(result).toEqual(user);
  });

  it('should find user by ID', async () => {
    const user = mockUserArray[0];
    mockRepo.findOne.mockResolvedValue(user);

    const result = await service.findById(user.id);

    expect(result).toEqual(user);
  });

  it('should return inactive users', async () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 40);

    const inactiveUsers = [{ ...mockUserArray[0], last_login: oldDate }];
    mockRepo.find.mockResolvedValue(inactiveUsers);

    const result = await service.findInactiveUsers();

    expect(mockRepo.find).toHaveBeenCalledWith({
      where: [{ last_login: expect.any(Object) }],
      order: { last_login: 'ASC' },
    });

    expect(result).toEqual(inactiveUsers);
  });
});
