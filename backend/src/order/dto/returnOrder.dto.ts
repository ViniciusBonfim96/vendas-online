import { ReturnUserDto } from '@/user/dtos/returnUser.dto';
import { OrderEntity } from '@/order/entity/order.entity';
import { ReturnAddressDto } from '@/address/dto/returnAddress.fto';
import { ReturnPaymentDto } from '@/payment/dto/returnPayment.dto';
import { OrderProductEntity } from '@/order-product/entity/orderProduct.entity';

export class ReturnOrderDto {
  id: number;
  date: string;
  user?: ReturnUserDto;
  address?: ReturnAddressDto;
  payment?: ReturnPaymentDto;
  ordersProduct?: OrderProductEntity[];

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.date = order.date.toString();
    this.user = order.user ? new ReturnUserDto(order.user) : undefined;
    this.address = order.address
      ? new ReturnAddressDto(order.address)
      : undefined;
    this.payment = order.payment
      ? new ReturnPaymentDto(order.payment)
      : undefined;
    this.ordersProduct = order.ordersProduct;
  }
}
