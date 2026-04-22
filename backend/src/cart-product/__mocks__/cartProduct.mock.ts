import { CartProductEntity } from '@/cart-product/entity/cart-product.entity';
import { cartEntityMock } from '@/cart/__mocks__/cart.mock';
import { productEntityMock } from '@/product/__mocks__/product.mock';

export const cartProductEntityMock: CartProductEntity = {
  id: 9999999,
  cartId: 9999999,
  productId: productEntityMock.id,
  amount: 2,
  created_at: new Date(),
  updated_at: new Date(),
};
