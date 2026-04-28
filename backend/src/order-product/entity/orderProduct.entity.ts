import { OrderEntity } from '@/order/entity/order.entity';
import { ProductEntity } from '@/product/entity/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'order_product' })
export class OrderProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'order_id', type: 'int', nullable: false })
  orderId!: number;

  @Column({ name: 'product_id', type: 'int', nullable: false })
  productId!: number;

  @Column({ name: 'amount', type: 'int', nullable: false })
  amount!: number;

  @Column({ name: 'price', type: 'double precision', nullable: false })
  price!: number;

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

  @ManyToOne(() => OrderEntity, (order) => order.ordersProduct)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order?: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.ordersProduct)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: ProductEntity;

  amountProducts?: number;
}
