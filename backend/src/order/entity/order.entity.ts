import {
  Column,
  CreateDateColumn,
  Entity,
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
}
