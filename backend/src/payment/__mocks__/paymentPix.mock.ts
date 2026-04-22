import { PaymentPixEntity } from '@/payment/entity/paymentPix.entity';
import { paymentEntityMock } from '@/payment/__mocks__/payment.mock';

export const paymentPixEntityMock: PaymentPixEntity = {
  ...paymentEntityMock,
  code: 'fdsafdsa',
  datePayment: new Date('2020-01-01'),
};
