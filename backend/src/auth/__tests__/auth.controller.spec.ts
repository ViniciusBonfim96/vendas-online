import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { loginMock } from '@/auth/__mocks__/login.mock';
import { returnLoginMock } from '@/auth/__mocks__/returnLogin.mock';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn().mockResolvedValue(returnLoginMock),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login successfully', async () => {
    const result = await controller.signIn(loginMock);

    expect(authService.signIn).toHaveBeenCalledWith(loginMock);

    expect(result).toEqual(returnLoginMock);
  });

  it('should throw error when service fails', async () => {
    jest
      .spyOn(authService, 'signIn')
      .mockRejectedValueOnce(new Error('Invalid credentials'));

    await expect(controller.signIn(loginMock)).rejects.toThrow(
      'Invalid credentials',
    );
  });
});
