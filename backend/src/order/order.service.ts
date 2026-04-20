import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '@/order/entity/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '@/order/dto/createOrder.dto';
import { PaymentService } from '@/payment/payment.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderEntity: Repository<OrderEntity>,
    private readonly paymentService: PaymentService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, cartId: number) {
    await this.paymentService.createPayment(createOrderDto);
  }
}
