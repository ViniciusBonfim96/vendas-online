import { productEntityMock } from '@/product/__mocks__/product.mock';
import { UpdateProductDto } from '@/product/dto/update-product.dto';

export const updateProductMock: UpdateProductDto = {
  name: productEntityMock.name,
  categoryId: productEntityMock.categoryId,
  price: productEntityMock.price,
  image: productEntityMock.image,
};
