import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from '@/address/address.service';
import { AddressEntity } from '@/address/entity/address.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '@/user/user.service';
import { CityService } from '@/city/city.service';
import { addressEntityMock } from '../__mocks__/address.mock';
import { createAddressMock } from '../__mocks__/create-address.mock';

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
          useValue: { save: jest.fn().mockResolvedValue(addressEntityMock) },
        },
        {
          provide: UserService,
          useValue: { findUserById: jest.fn().mockResolvedValue(true) },
        },
        {
          provide: CityService,
          useValue: { findCityById: jest.fn().mockResolvedValue(true) },
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

  it('should throw error if user not found', async () => {
    jest.spyOn(userService, 'findUserById').mockRejectedValueOnce(new Error());

    await expect(service.createAddress(createAddressMock, 1)).rejects.toThrow();

    expect(addressRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error if city not found', async () => {
    jest.spyOn(cityService, 'findCityById').mockRejectedValueOnce(new Error());

    await expect(service.createAddress(createAddressMock, 1)).rejects.toThrow();

    expect(addressRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error if repository fails', async () => {
    jest.spyOn(addressRepository, 'save').mockRejectedValueOnce(new Error());

    await expect(service.createAddress(createAddressMock, 1)).rejects.toThrow();
  });
});
