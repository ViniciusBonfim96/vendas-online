import { addressEntityMock } from '@/address/__mocks__/address.mock';
import { CreateOrderDto } from '@/order/dto/createOrder.dto';

export const createOrderMock: CreateOrderDto = {
  amountPayments: 2,
  addressId: addressEntityMock.id,
};
