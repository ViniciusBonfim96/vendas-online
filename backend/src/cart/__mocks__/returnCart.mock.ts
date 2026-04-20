import { cartProductEntityMock } from '@/cart-product/__mocks__/cartProduct.mock';
import { ReturnCartDto } from '@/cart/dto/returnCart.dto';

export const returnCartMock: ReturnCartDto = {
  id: 1,
  cartProduct: [cartProductEntityMock],
};
