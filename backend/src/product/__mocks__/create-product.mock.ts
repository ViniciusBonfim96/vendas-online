import { CreateProductDto } from '@/product/dto/create-product.dto';
import { productEntityMock } from '@/product/__mocks__/product.mock';

export const createProductMock: CreateProductDto = {
  name: productEntityMock.name,
  categoryId: productEntityMock.categoryId,
  price: productEntityMock.price,
  image: productEntityMock.image,
};
