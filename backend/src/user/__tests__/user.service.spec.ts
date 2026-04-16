import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@/user/entity/user.entity';
import { UserService } from '@/user/user.service';
import { createUserMock } from '@/user/__mocks__/createUser.mock';
import { userEntityMock } from '@/user/__mocks__/user.mock';

jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));
import { compare, hash } from 'bcrypt';
import { updatePasswordMock } from '@/user/__mocks__/updatePassword.mock';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(userEntityMock),
            find: jest.fn().mockResolvedValue([userEntityMock]),
            create: jest.fn().mockReturnValue(userEntityMock),
            save: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should return user by email', async () => {
    const user = await service.findUserByEmail(userEntityMock.email);

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: userEntityMock.email },
    });

    expect(user).toEqual(userEntityMock);
  });

  it('should throw error when user by email does not exist', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(
      service.findUserByEmail(userEntityMock.email),
    ).rejects.toThrow();
  });

  it('should throw error when DB fails on findUserByEmail', async () => {
    jest
      .spyOn(userRepository, 'findOne')
      .mockRejectedValueOnce(new Error('DB error'));

    await expect(service.findUserByEmail(userEntityMock.email)).rejects.toThrow(
      'DB error',
    );
  });

  it('should return user by id', async () => {
    const user = await service.findUserById(userEntityMock.id);

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: userEntityMock.id },
    });

    expect(user).toEqual(userEntityMock);
  });

  it('should throw error when user by id does not exist', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(service.findUserById(userEntityMock.id)).rejects.toThrow();
  });

  it('should throw error when DB fails on findUserById', async () => {
    jest
      .spyOn(userRepository, 'findOne')
      .mockRejectedValueOnce(new Error('DB error'));

    await expect(service.findUserById(userEntityMock.id)).rejects.toThrow(
      'DB error',
    );
  });

  it('should return user with relations', async () => {
    const user = await service.getUserByIdUsingRelations(userEntityMock.id);

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: userEntityMock.id },
      relations: {
        addresses: {
          city: {
            state: true,
          },
        },
      },
    });

    expect(user).toEqual(userEntityMock);
  });

  it('should return all users', async () => {
    const user = await service.getAllUser();

    expect(userRepository.find).toHaveBeenCalled();
    expect(user).toEqual([userEntityMock]);
  });

  it('should throw error when user already exists', async () => {
    await expect(service.createUser(createUserMock)).rejects.toThrow(
      'Email or CPF already exists',
    );
  });

  it('should create user when not exists', async () => {
    jest.spyOn(userRepository, 'find').mockResolvedValueOnce([]);
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

    const user = await service.createUser(createUserMock);

    expect(userRepository.find).toHaveBeenCalledWith({
      where: [{ email: createUserMock.email }, { cpf: createUserMock.cpf }],
    });

    expect(userRepository.create).toHaveBeenCalledWith({
      ...createUserMock,
      type_user: 1,
      password: 'hashedPassword',
    });

    expect(userRepository.save).toHaveBeenCalled();

    expect(user).toEqual(userEntityMock);
  });

  it('should update password successfully', async () => {
    jest.spyOn(service, 'findUserById').mockResolvedValueOnce(userEntityMock);

    const result = await service.updatePasswordUser(1, updatePasswordMock);

    expect(service.findUserById).toHaveBeenCalledWith(1);

    expect(compare).toHaveBeenCalledWith(
      updatePasswordMock.lastPassword,
      userEntityMock.password,
    );

    expect(hash).toHaveBeenCalledWith(updatePasswordMock.newPassword, 10);

    expect(userRepository.save).toHaveBeenCalledWith({
      ...userEntityMock,
      password: 'hashedPassword',
    });

    expect(result).toEqual(userEntityMock);
  });

  it('should throw error when last password is invalid', async () => {
    jest.spyOn(service, 'findUserById').mockResolvedValueOnce(userEntityMock);

    (compare as jest.Mock).mockResolvedValueOnce(false);

    await expect(
      service.updatePasswordUser(1, updatePasswordMock),
    ).rejects.toThrow('The last password invalid');

    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when user not found', async () => {
    jest
      .spyOn(service, 'findUserById')
      .mockRejectedValueOnce(new Error('User not found'));

    await expect(
      service.updatePasswordUser(1, updatePasswordMock),
    ).rejects.toThrow('User not found');

    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when hash fails', async () => {
    jest.spyOn(service, 'findUserById').mockResolvedValueOnce(userEntityMock);

    (compare as jest.Mock).mockResolvedValueOnce(true);
    (hash as jest.Mock).mockRejectedValueOnce(new Error('Hash error'));

    await expect(
      service.updatePasswordUser(1, updatePasswordMock),
    ).rejects.toThrow('Hash error');

    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when repository fails on update password', async () => {
    jest.spyOn(service, 'findUserById').mockResolvedValueOnce(userEntityMock);

    (compare as jest.Mock).mockResolvedValueOnce(true);
    (hash as jest.Mock).mockResolvedValueOnce('hashedPassword');

    jest
      .spyOn(userRepository, 'save')
      .mockRejectedValueOnce(new Error('DB error'));

    await expect(
      service.updatePasswordUser(1, updatePasswordMock),
    ).rejects.toThrow('DB error');

    expect(userRepository.save).toHaveBeenCalled();
  });
});
