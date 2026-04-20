import { cityEntityMock } from '@/city/__mocks__/city.mock';
import { addressEntityMock } from '@/address/__mocks__/address.mock';
import { CreateAddressDto } from '../dto/createAddress.dto';

export const createAddressMock: CreateAddressDto = {
  cep: addressEntityMock.cep,
  cityId: cityEntityMock.id,
  complement: addressEntityMock.complement,
  numberAddress: addressEntityMock.numberAddress,
};
