import { paymentEntityMock } from '@/payment/__mocks__/payment.mock';
import { PaymentCreditCardEntity } from '@/payment/entity/paymentCreditCard.entity';

export const paymentCreditCardEntityMock: PaymentCreditCardEntity = {
  ...paymentEntityMock,
  amountPayments: 54,
};
