import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUserRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return it without password', async () => {
      const dto = {
        name: 'Alice',
        email: 'alice@example.com',
        password: 'securepass',
        role: 'user',
      };

      mockUserRepo.findOne.mockResolvedValue(null);
      mockUserRepo.create.mockImplementation((data) => data);
      mockUserRepo.save.mockImplementation(async (data) => ({ ...data, id: 1 }));

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const result = await service.register(dto);

      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { email: dto.email } });
      expect(mockUserRepo.create).toHaveBeenCalled();
      expect(mockUserRepo.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: 1,
        name: dto.name,
        email: dto.email,
        role: dto.role,
      });
    });

    it('should throw if email already exists', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 1, email: 'alice@example.com' });

      await expect(
        service.register({
          name: 'Alice',
          email: 'alice@example.com',
          password: '123456',
          role: 'user',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashedpass' };
      mockUserRepo.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser('test@example.com', 'plain');

      expect(result).toBe(user);
    });

    it('should throw if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(service.validateUser('a@b.com', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password is incorrect', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 1, email: 'test', password: 'hash' });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.validateUser('a@b.com', 'wrong')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return JWT and user object', async () => {
      const user = {
        id: 1,
        email: 'john@example.com',
        name: 'John',
        role: 'admin',
        password: 'hashed',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(user as any);
      mockJwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await service.login(user.email, 'password');

      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
      expect(mockUserRepo.update).toHaveBeenCalled();
    });
  });
});
