import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call authService.register and return result', async () => {
      const dto: RegisterDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      };

      const expectedResult = {
        id: 1,
        name: dto.name,
        email: dto.email,
        role: dto.role,
        created_at: new Date(),
        update_at: new Date(),
        last_login: new Date(),
      };

      jest.spyOn(mockAuthService, 'register').mockResolvedValue(expectedResult);

      const result = await controller.register(dto);

      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should call authService.login and return token with user', async () => {
      const dto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const expectedToken = {
        access_token: 'fake-jwt-token',
        user: {
          id: 1,
          email: dto.email,
          name: 'John Doe',
          role: 'user',
        },
      };

      jest.spyOn(mockAuthService, 'login').mockResolvedValue(expectedToken);

      const result = await controller.login(dto);

      expect(mockAuthService.login).toHaveBeenCalledWith(dto.email, dto.password);
      expect(result).toEqual(expectedToken);
    });
  });
});
