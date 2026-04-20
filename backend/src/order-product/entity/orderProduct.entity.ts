import {
  Column,
  CreateDateColumn,
  Entity,
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
}
