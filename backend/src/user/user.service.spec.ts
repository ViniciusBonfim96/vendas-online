import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@/user/entity/user.entity';
import { UserService } from '@/user/user.service';
import { createUserMock } from '@/__mocks__/user/createUser.mock';
import { userEntityMock } from '@/__mocks__/user/user.mock';

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

  it('should return user in findUserByEmail', async () => {
    const user = await service.findUserByEmail(userEntityMock.email);

    expect(user).toEqual(userEntityMock);
  });

  it('should return error in findUserByEmail', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(
      service.findUserByEmail(userEntityMock.email),
    ).rejects.toThrow();
  });

  it('should return error in findUserByEmail (error DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

    await expect(
      service.findUserByEmail(userEntityMock.email),
    ).rejects.toThrow();
  });

  it('should return user in findUserById', async () => {
    const user = await service.findUserById(userEntityMock.id);

    expect(user).toEqual(userEntityMock);
  });

  it('should return error in findUserById', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(service.findUserById(userEntityMock.id)).rejects.toThrow();
  });

  it('should return error in findUserById (error DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

    await expect(service.findUserById(userEntityMock.id)).rejects.toThrow();
  });

  it('should return user in getUserByIdUsingRelations', async () => {
    const user = await service.getUserByIdUsingRelations(userEntityMock.id);

    expect(user).toEqual(userEntityMock);
  });

  it('should return error if user exist', async () => {
    await expect(service.createUser(createUserMock)).rejects.toThrow();
  });

  it('should return user if user not exist', async () => {
    jest.spyOn(userRepository, 'find').mockResolvedValueOnce([]);
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

    const user = await service.createUser(createUserMock);

    expect(user).toEqual(userEntityMock);
  });
});
