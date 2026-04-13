import { CityEntity } from '@/city/entity/city.entity';
import { UserEntity } from '@/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'address' })
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'integer', nullable: false })
  userId!: number;

  @Column({ name: 'complement', type: 'varchar', length: 255, nullable: false })
  complement!: string;

  @Column({ name: 'number', type: 'integer', nullable: false })
  numberAddress!: number;

  @Column({ name: 'cep', type: 'varchar', length: 255, nullable: false })
  cep!: string;

  @Column({ name: 'city_id', type: 'integer', nullable: false })
  cityId!: number;

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

  @ManyToOne(() => UserEntity, (user) => user.addresses)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;

  @ManyToOne(() => CityEntity, (city) => city.addresses)
  @JoinColumn({ name: 'city_id', referencedColumnName: 'id' })
  city?: CityEntity;
}
