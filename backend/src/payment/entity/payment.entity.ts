import { NameField } from '@/common/validation';
import {
  Column,
  CreateDateColumn,
  Entity,
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
}
