import { Module } from '@nestjs/common';
import { OrderController } from '@/order/order.controller';
import { OrderService } from '@/order/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@/order/entity/order.entity';
import { PaymentModule } from '@/payment/payment.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), PaymentModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
