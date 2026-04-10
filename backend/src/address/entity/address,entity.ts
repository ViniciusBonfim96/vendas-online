import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'address' })
export class addressEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'integer', nullable: false })
  user_id!: number;

  @Column({ name: 'complement', type: 'varchar', length: 255, nullable: true })
  complement?: string;

  @Column({ name: 'number', type: 'integer', nullable: false })
  numberAddress!: number;

  @Column({ name: 'cep', type: 'varchar', length: 255, nullable: false })
  cep!: string;

  @Column({ name: 'city_id', type: 'integer', nullable: false })
  city_id!: number;

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
