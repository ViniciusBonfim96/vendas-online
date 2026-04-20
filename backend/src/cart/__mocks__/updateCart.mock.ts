import { productEntityMock } from '@/product/__mocks__/product.mock';
import { UpdateCardDto } from '@/cart/dto/updateCart.dto';

export const updateCartMock: UpdateCardDto = {
  productId: productEntityMock.id,
  amount: 1,
};
