import { NameField } from '@/common/validation';
import { OrderEntity } from '@/order/entity/order.entity';
import { PaymentStatusEntity } from '@/payment-status/entity/paymentStatus.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'payment' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class PaymentEntity {
  @PrimaryGeneratedColumn('rowid')
  id!: number;

  @Column({ name: 'status_id', type: 'int', nullable: false })
  statusId!: number;

  @Column({ name: 'price', type: 'double precision', nullable: false })
  price!: number;

  @Column({ name: 'discount', type: 'double precision', nullable: false })
  discount!: number;

  @Column({ name: 'final_price', type: 'double precision', nullable: false })
  finalPrice!: number;

  @NameField()
  type!: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date;

  @OneToMany(() => OrderEntity, (order) => order.payment)
  orders?: OrderEntity[];

  @ManyToOne(() => PaymentStatusEntity, (payment) => payment.payments)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  paymentStatus?: PaymentStatusEntity;

  constructor(
    statusId: number,
    price: number,
    discount: number,
    finalPrice: number,
  ) {
    this.statusId = statusId;
    this.price = price;
    this.discount = discount;
    this.finalPrice = finalPrice;
  }
}
