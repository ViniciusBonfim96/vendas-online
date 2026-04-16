import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from '@/address/address.service';
import { AddressEntity } from '@/address/entity/address.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '@/user/user.service';
import { CityService } from '@/city/city.service';
import { addressEntityMock } from '../__mocks__/address.mock';
import { createAddressMock } from '../__mocks__/create-address.mock';
import { userEntityMock } from '@/user/__mocks__/user.mock';

describe('AddressService', () => {
  let service: AddressService;
  let addressRepository: Repository<AddressEntity>;
  let userService: UserService;
  let cityService: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: getRepositoryToken(AddressEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(addressEntityMock),
            find: jest.fn().mockResolvedValue([addressEntityMock]),
          },
        },
        {
          provide: UserService,
          useValue: {
            findUserById: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
        {
          provide: CityService,
          useValue: {
            findCityById: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    addressRepository = module.get<Repository<AddressEntity>>(
      getRepositoryToken(AddressEntity),
    );
    userService = module.get<UserService>(UserService);
    cityService = module.get<CityService>(CityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(addressRepository).toBeDefined();
    expect(userService).toBeDefined();
    expect(cityService).toBeDefined();
  });

  it('should create address successfully', async () => {
    const result = await service.createAddress(createAddressMock, 1);

    expect(userService.findUserById).toHaveBeenCalledWith(1);

    expect(cityService.findCityById).toHaveBeenCalledWith(
      createAddressMock.cityId,
    );

    expect(addressRepository.save).toHaveBeenCalledWith({
      ...createAddressMock,
      userId: 1,
    });

    expect(result).toEqual(addressEntityMock);
  });

  it('should throw error when user does not exist', async () => {
    jest
      .spyOn(userService, 'findUserById')
      .mockRejectedValueOnce(new Error('User not found'));

    await expect(service.createAddress(createAddressMock, 1)).rejects.toThrow(
      'User not found',
    );

    expect(addressRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when city does not exist', async () => {
    jest
      .spyOn(cityService, 'findCityById')
      .mockRejectedValueOnce(new Error('City not found'));

    await expect(service.createAddress(createAddressMock, 1)).rejects.toThrow(
      'City not found',
    );

    expect(addressRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when repository fails on save', async () => {
    jest
      .spyOn(addressRepository, 'save')
      .mockRejectedValueOnce(new Error('Database error'));

    await expect(service.createAddress(createAddressMock, 1)).rejects.toThrow(
      'Database error',
    );
  });

  it('should return all addresses by user id', async () => {
    const result = await service.findAddressByUserId(userEntityMock.id);

    expect(addressRepository.find).toHaveBeenCalledWith({
      where: { userId: userEntityMock.id },
      relations: {
        city: {
          state: true,
        },
      },
    });

    expect(result).toEqual([addressEntityMock]);
  });

  it('should throw error when no addresses exist for user', async () => {
    jest.spyOn(addressRepository, 'find').mockResolvedValueOnce([]);

    await expect(
      service.findAddressByUserId(userEntityMock.id),
    ).rejects.toThrow();

    expect(addressRepository.find).toHaveBeenCalledWith({
      where: { userId: userEntityMock.id },
      relations: {
        city: {
          state: true,
        },
      },
    });
  });
});
