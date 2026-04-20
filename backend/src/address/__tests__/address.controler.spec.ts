import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from '@/address/address.controller';
import { AddressService } from '@/address/address.service';
import { addressEntityMock } from '@/address/__mocks__/address.mock';
import { createAddressMock } from '@/address/__mocks__/create-address.mock';
import { ReturnAddressDto } from '@/address/dto/returnAddress.fto';
import { userEntityMock } from '@/user/__mocks__/user.mock';

describe('AddressController', () => {
  let controller: AddressController;
  let addressService: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: AddressService,
          useValue: {
            createAddress: jest.fn().mockResolvedValue(addressEntityMock),
            findAddressByUserId: jest
              .fn()
              .mockResolvedValue([addressEntityMock]),
          },
        },
      ],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    addressService = module.get<AddressService>(AddressService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create address', async () => {
    const result = await controller.createAddress(
      createAddressMock,
      userEntityMock.id,
    );

    expect(addressService.createAddress).toHaveBeenCalledWith(
      createAddressMock,
      userEntityMock.id,
    );

    expect(result).toEqual(addressEntityMock);
  });

  it('should throw error when service fails on createAddress', async () => {
    jest
      .spyOn(addressService, 'createAddress')
      .mockRejectedValueOnce(new Error('error'));

    await expect(
      controller.createAddress(createAddressMock, userEntityMock.id),
    ).rejects.toThrow();
  });

  it('should return address list as DTO', async () => {
    const result = await controller.findAddressByUserId(userEntityMock.id);

    expect(addressService.findAddressByUserId).toHaveBeenCalledWith(
      userEntityMock.id,
    );

    expect(result).toEqual([new ReturnAddressDto(addressEntityMock)]);
  });

  it('should return empty list when no address', async () => {
    jest.spyOn(addressService, 'findAddressByUserId').mockResolvedValueOnce([]);

    const result = await controller.findAddressByUserId(userEntityMock.id);

    expect(result).toEqual([]);
  });

  it('should throw error when service fails on findAddressByUserId', async () => {
    jest
      .spyOn(addressService, 'findAddressByUserId')
      .mockRejectedValueOnce(new Error('DB error'));

    await expect(controller.findAddressByUserId(1)).rejects.toThrow('DB error');
  });
});
