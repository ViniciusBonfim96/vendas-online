import { CartEntity } from '@/cart/entity/cart.entity';
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

@Entity({ name: 'cart_product' })
export class CartProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'cart_id', type: 'int', nullable: false })
  cartId!: number;

  @Column({ name: 'product_id', type: 'int', nullable: false })
  productId!: number;

  @Column({ name: 'amount', type: 'int', nullable: false })
  amount!: number;

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

  @ManyToOne(
    () => ProductEntity,
    (productEntity: ProductEntity) => productEntity.cartProduct,
  )
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: ProductEntity;

  @ManyToOne(() => CartEntity, (cartEntity) => cartEntity.cartProduct)
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart?: CartEntity;
}
