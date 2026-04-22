import { orderEntityMock } from '@/order/__mocks__/order.mock';
import { OrderProductEntity } from '../entity/orderProduct.entity';
import { productEntityMock } from '@/product/__mocks__/product.mock';

export const orderProductEntityMock: OrderProductEntity = {
  id: 9999999,
  orderId: orderEntityMock.id,
  productId: productEntityMock.id,
  amount: 1,
  price: 2,
  created_at: new Date(),
  updated_at: new Date(),
};
