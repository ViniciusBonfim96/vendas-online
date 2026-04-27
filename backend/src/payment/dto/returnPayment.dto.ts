import { PaymentStatusEntity } from '@/payment-status/entity/paymentStatus.entity';
import { PaymentEntity } from '@/payment/entity/payment.entity';

export class ReturnPaymentDto {
  id: number;
  statusId: number;
  price: number;
  discount: number;
  finalPrice: number;
  type: string;
  paymentStatus?: PaymentStatusEntity;

  constructor(payment: PaymentEntity) {
    this.id = payment.id;
    this.statusId = payment.statusId;
    this.price = payment.price;
    this.discount = payment.discount;
    this.finalPrice = payment.finalPrice;
    this.type = payment.type;
    this.paymentStatus = payment.paymentStatus;
  }
}
