import { cityEntityMock } from '@/city/__mock__/city.mock';
import { addressEntityMock } from './address.mock';
import { CreateAddressDto } from '../dto/createAddress.dto';

export const createAddressMock: CreateAddressDto = {
  cep: addressEntityMock.cep,
  cityId: cityEntityMock.id,
  complement: addressEntityMock.complement,
  numberAddress: addressEntityMock.numberAddress,
};
