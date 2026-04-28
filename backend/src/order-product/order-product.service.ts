import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProductEntity } from '@/order-product/entity/orderProduct.entity';
import { Repository } from 'typeorm';
import { ReturnGroupOrderDto } from '@/order-product/dto/returnGroupOrder.dto';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProductEntity)
    private readonly orderProductRepository: Repository<OrderProductEntity>,
  ) {}

  async createOrderProduct(
    productId: number,
    orderId: number,
    price: number,
    amount: number,
  ): Promise<OrderProductEntity> {
    return this.orderProductRepository.save({
      amount,
      orderId,
      price,
      productId,
    });
  }

  async findAmountProductsByOrderId(
    orderId: number[],
  ): Promise<ReturnGroupOrderDto[]> {
    if (!orderId.length) return [];

    return this.orderProductRepository
      .createQueryBuilder('order_product')
      .select('order_product.orderId', 'order_id')
      .addSelect('COUNT(*)', 'total')
      .where('order_product.orderId IN (:...ids)', { ids: orderId })
      .groupBy('order_product.orderId')
      .getRawMany();
  }
}
