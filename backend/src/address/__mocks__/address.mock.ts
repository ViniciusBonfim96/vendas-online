import { cityEntityMock } from '@/city/__mocks__/city.mock';
import { AddressEntity } from '@/address/entity/address.entity';
import { userEntityMock } from '@/user/__mocks__/user.mock';

export const addressEntityMock: AddressEntity = {
  id: 9999999,
  userId: userEntityMock.id,
  complement: 'Rua Mock',
  cep: '12345678',
  cityId: cityEntityMock.id,
  numberAddress: 522,
  created_at: new Date(),
  updated_at: new Date(),
};
