import { stateEntityMock } from '@/state/__mocks__/state.mock';
import { CityEntity } from '../entity/city.entity';

export const cityEntityMock: CityEntity = {
  id: 9999999,
  name: 'nameMock',
  state_id: stateEntityMock.id,
  created_at: new Date(),
  updated_at: new Date(),
};
