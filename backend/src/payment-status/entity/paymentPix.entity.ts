import { PaymentEntity } from '@/payment/entity/payment.entity';
import { ChildEntity, Column, CreateDateColumn } from 'typeorm';

@ChildEntity()
export class PaymentPixEntity extends PaymentEntity {
  @Column({ name: 'code', nullable: false })
  code!: number;

  @CreateDateColumn({
    name: 'date_payment',
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  datePayment!: Date;
}
