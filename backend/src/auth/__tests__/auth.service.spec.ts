import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@/auth/auth.service';
import { UserService } from '@/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { userEntityMock } from '@/user/__mocks__/user.mock';
import { ReturnUserDto } from '@/user/dtos/returnUser.dto';
import { loginMock } from '@/auth/__mocks__/login.mock';
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));
import { compare } from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  const mockedCompare = compare as unknown as jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('fakeToken') },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login successfully', async () => {
    (compare as jest.Mock).mockResolvedValueOnce(true);

    const result = await service.singIn(loginMock);

    expect(userService.findUserByEmail).toHaveBeenCalledWith(loginMock.email);

    expect(compare).toHaveBeenCalledWith(
      loginMock.password,
      userEntityMock.password,
    );

    expect(jwtService.sign).toHaveBeenCalledWith({
      id: userEntityMock.id,
      typeUser: userEntityMock.type_user,
    });

    expect(result).toEqual({
      user: new ReturnUserDto(userEntityMock),
      accessToken: 'fakeToken',
    });
  });

  it('should throw error if user not found', async () => {
    jest
      .spyOn(userService, 'findUserByEmail')
      .mockRejectedValueOnce(new Error());

    mockedCompare.mockResolvedValueOnce(false);

    await expect(service.singIn(loginMock)).rejects.toThrow(
      'Email or password invalid.',
    );
  });

  it('should throw error if password does not match', async () => {
    mockedCompare.mockResolvedValueOnce(false);

    await expect(service.singIn(loginMock)).rejects.toThrow();
  });

  it('should throw error if bcrypt fails', async () => {
    mockedCompare.mockRejectedValueOnce(new Error());

    await expect(service.singIn(loginMock)).rejects.toThrow();
  });
});
