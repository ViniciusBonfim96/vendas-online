import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';
import { userEntityMock } from '@/user/__mocks__/user.mock';
import { createUserMock } from '@/user/__mocks__/createUser.mock';
import { ReturnUserDto } from '@/user/dtos/returnUser.dto';
import { updatePasswordMock } from '@/user/__mocks__/updatePassword.mock';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getAllUser: jest.fn().mockResolvedValue([userEntityMock]),
            createUser: jest.fn().mockResolvedValue(userEntityMock),
            getUserByIdUsingRelations: jest
              .fn()
              .mockResolvedValue(userEntityMock),
            updatePasswordUser: jest.fn().mockResolvedValue(userEntityMock),
          },
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
  });

  it('should return all users', async () => {
    const result = await controller.getAllUsers();

    expect(userService.getAllUser).toHaveBeenCalled();

    expect(result).toEqual([new ReturnUserDto(userEntityMock)]);
  });

  it('should throw error when service fails on getAllUsers', async () => {
    jest
      .spyOn(userService, 'getAllUser')
      .mockRejectedValueOnce(new Error('DB error'));

    await expect(controller.getAllUsers()).rejects.toThrow('DB error');
  });

  it('should create user', async () => {
    const result = await controller.createUser(createUserMock);

    expect(userService.createUser).toHaveBeenCalledWith(createUserMock);
    expect(result).toEqual(userEntityMock);
  });

  it('should throw error when service fails on createUser', async () => {
    jest
      .spyOn(userService, 'createUser')
      .mockRejectedValueOnce(new Error('error'));

    await expect(controller.createUser(createUserMock)).rejects.toThrow();
  });

  it('should return user by id', async () => {
    const result = await controller.getUserById(1);

    expect(userService.getUserByIdUsingRelations).toHaveBeenCalledWith(1);

    expect(result).toEqual(new ReturnUserDto(userEntityMock));
  });

  it('should throw error when service fails on getUserById', async () => {
    jest
      .spyOn(userService, 'getUserByIdUsingRelations')
      .mockRejectedValueOnce(new Error('error'));

    await expect(controller.getUserById(1)).rejects.toThrow();
  });

  it('should update password', async () => {
    const result = await controller.updatePasswordUser(updatePasswordMock, 1);

    expect(userService.updatePasswordUser).toHaveBeenCalledWith(
      1,
      updatePasswordMock,
    );

    expect(result).toEqual(userEntityMock);
  });

  it('should throw error when service fails on updatePassword', async () => {
    jest
      .spyOn(userService, 'updatePasswordUser')
      .mockRejectedValueOnce(new Error('error'));

    await expect(
      controller.updatePasswordUser(updatePasswordMock, 1),
    ).rejects.toThrow();
  });
});
