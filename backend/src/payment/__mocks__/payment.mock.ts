import { PaymentType } from '@/payment-status/enum/paymentType.enum';
import { PaymentEntity } from '@/payment/entity/payment.entity';

export const paymentEntityMock: PaymentEntity = {
  id: 9999999,
  statusId: PaymentType.Done,
  price: 32532.0,
  discount: 432,
  finalPrice: 64365.4,
  type: '',
  created_at: new Date(),
  updated_at: new Date(),
};
