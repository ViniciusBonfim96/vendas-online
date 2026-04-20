import { Module } from '@nestjs/common';
import { PaymentService } from '@/payment/payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from '@/payment/entity/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
