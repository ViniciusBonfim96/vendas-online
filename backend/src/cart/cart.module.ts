import { Module } from '@nestjs/common';
import { CartController } from '@/cart/cart.controller';
import { CartService } from '@/cart/cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from '@/cart/entity/cart.entity';
import { CartProductModule } from '@/cart-product/cart-product.module';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity]), CartProductModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
