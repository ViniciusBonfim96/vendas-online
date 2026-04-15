import { categoryEntityMock } from '@/category/__mocks__/category.mock';
import { ProductEntity } from '@/product/entity/product.entity';

export const productEntityMock: ProductEntity = {
  id: 999999,
  name: 'nameMock',
  categoryId: categoryEntityMock.id,
  price: 1.1,
  image: 'http://image.com',
  created_at: new Date(),
  updated_at: new Date(),
};
