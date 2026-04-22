import { userEntityMock } from '@/user/__mocks__/user.mock';
import { OrderEntity } from '@/order/entity/order.entity';
import { addressEntityMock } from '@/address/__mocks__/address.mock';
import { paymentEntityMock } from '@/payment/__mocks__/payment.mock';

export const orderEntityMock: OrderEntity = {
  id: 9999999,
  userId: userEntityMock.id,
  addressId: addressEntityMock.id,
  paymentId: paymentEntityMock.id,
  date: new Date(),
  created_at: new Date(),
  updated_at: new Date(),
};
