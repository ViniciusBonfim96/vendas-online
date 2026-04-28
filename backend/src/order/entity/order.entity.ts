import { AddressEntity } from '@/address/entity/address.entity';
import { OrderProductEntity } from '@/order-product/entity/orderProduct.entity';
import { PaymentEntity } from '@/payment/entity/payment.entity';
import { UserEntity } from '@/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'order' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'int', nullable: false })
  userId!: number;

  @Column({ name: 'address_id', type: 'int', nullable: false })
  addressId!: number;

  @Column({
    name: 'date',
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date!: Date;

  @Column({ name: 'payment_id', type: 'int', nullable: false })
  paymentId!: number;

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

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;

  @ManyToOne(() => AddressEntity, (address) => address.orders)
  @JoinColumn({ name: 'address_id', referencedColumnName: 'id' })
  address?: AddressEntity;

  @ManyToOne(() => PaymentEntity, (payment) => payment.orders)
  @JoinColumn({ name: 'payment_id', referencedColumnName: 'id' })
  payment?: PaymentEntity;

  @OneToMany(() => OrderProductEntity, (orderProduct) => orderProduct.order)
  ordersProduct?: OrderProductEntity[];

  amountProducts?: number;
}
