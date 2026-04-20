import { productEntityMock } from '@/product/__mocks__/product.mock';
import { InsertCardDto } from '@/cart/dto/insertCart.dto';

export const insertCartMock: InsertCardDto = {
  productId: productEntityMock.id,
  amount: 1,
};
