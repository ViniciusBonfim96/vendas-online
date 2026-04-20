import { CreateOrderDto } from '@/order/dto/createOrder.dto';
import { PaymentEntity } from '@/payment/entity/payment.entity';
import { ChildEntity, Column } from 'typeorm';

@ChildEntity()
export class PaymentPixEntity extends PaymentEntity {
  @Column({ name: 'code', nullable: false })
  code!: string;

  @Column({
    name: 'date_payment',
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  datePayment!: Date;

  constructor(
    statusId: number,
    price: number,
    discount: number,
    finalPrice: number,
    createOrderDto: CreateOrderDto,
  ) {
    super(statusId, price, discount, finalPrice);
    this.code = createOrderDto?.codePix || '';
    this.datePayment = new Date(createOrderDto?.datePayment || '');
  }
}
