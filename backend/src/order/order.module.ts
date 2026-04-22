import { Module } from '@nestjs/common';
import { OrderController } from '@/order/order.controller';
import { OrderService } from '@/order/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@/order/entity/order.entity';
import { PaymentModule } from '@/payment/payment.module';
import { CartModule } from '@/cart/cart.module';
import { OrderProductModule } from '@/order-product/order-product.module';
import { AddressModule } from '@/address/address.module';
import { ProductModule } from '@/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    PaymentModule,
    CartModule,
    OrderProductModule,
    AddressModule,
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
