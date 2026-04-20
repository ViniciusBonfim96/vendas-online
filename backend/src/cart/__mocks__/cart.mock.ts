import { userEntityMock } from '@/user/__mocks__/user.mock';
import { CartEntity } from '@/cart/entity/cart.entity';

export const cartEntityMock: CartEntity = {
  id: 9999999,
  userId: userEntityMock.id,
  active: true,
  created_at: new Date(),
  updated_at: new Date(),
};
