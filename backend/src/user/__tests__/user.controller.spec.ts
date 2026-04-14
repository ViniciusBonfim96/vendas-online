import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';
import { createUserMock } from '@/user/__mocks__/createUser.mock';
import { userEntityMock } from '@/user/__mocks__/user.mock';
import { ReturnUserDto } from '@/user/dtos/returnUser.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = () => ({
    getAllUser: jest.fn().mockResolvedValue([userEntityMock]),
    createUser: jest.fn().mockResolvedValue(userEntityMock),
    getUserByIdUsingRelations: jest.fn().mockResolvedValue(userEntityMock),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService(),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return all users', async () => {
    const result = await controller.getAllUsers();

    expect(userService.getAllUser).toHaveBeenCalled();
    expect(result).toEqual([new ReturnUserDto(userEntityMock)]);
  });

  it('should throw error in getAllUsers', async () => {
    jest.spyOn(userService, 'getAllUser').mockRejectedValueOnce(new Error());

    await expect(controller.getAllUsers()).rejects.toThrow();
  });

  it('should create user', async () => {
    const result = await controller.createUser(createUserMock);

    expect(userService.createUser).toHaveBeenCalledWith(createUserMock);
    expect(result).toEqual(userEntityMock);
  });

  it('should throw error in createUser', async () => {
    jest.spyOn(userService, 'createUser').mockRejectedValueOnce(new Error());

    await expect(controller.createUser(createUserMock)).rejects.toThrow();
  });

  it('should return user by id', async () => {
    const result = await controller.getUserById(userEntityMock.id);

    expect(userService.getUserByIdUsingRelations).toHaveBeenCalledWith(
      userEntityMock.id,
    );
    expect(result).toEqual(new ReturnUserDto(userEntityMock));
  });

  it('should throw error in getUserById', async () => {
    jest
      .spyOn(userService, 'getUserByIdUsingRelations')
      .mockRejectedValueOnce(new Error());

    await expect(controller.getUserById(userEntityMock.id)).rejects.toThrow();
  });
});
