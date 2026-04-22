import { userEntityMock } from '@/user/__mocks__/user.mock';
import { CartEntity } from '@/cart/entity/cart.entity';
import { cartProductEntityMock } from '@/cart-product/__mocks__/cartProduct.mock';

export const cartEntityMock: CartEntity = {
  id: 9999999,
  userId: userEntityMock.id,
  active: true,
  cartProduct: [cartProductEntityMock],
  created_at: new Date(),
  updated_at: new Date(),
};
