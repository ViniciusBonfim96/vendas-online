import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '@/order/entity/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '@/order/dto/createOrder.dto';
import { PaymentService } from '@/payment/payment.service';
import { PaymentEntity } from '@/payment/entity/payment.entity';
import { CartService } from '@/cart/cart.service';
import { OrderProductService } from '@/order-product/order-product.service';
import { AddressService } from '@/address/address.service';
import { ProductService } from '@/product/product.service';
import { CartEntity } from '@/cart/entity/cart.entity';
import { ProductEntity } from '@/product/entity/product.entity';
import { OrderProductEntity } from '@/order-product/entity/orderProduct.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
    private readonly orderProductService: OrderProductService,
    private readonly addressService: AddressService,
    private readonly productService: ProductService,
  ) {}

  async saveOrder(
    createOrderDto: CreateOrderDto,
    userId: number,
    payment: PaymentEntity,
  ): Promise<OrderEntity> {
    if (!payment || !payment.id) {
      throw new BadRequestException('Invalid payment');
    }

    const orderData = {
      addressId: createOrderDto.addressId,
      date: new Date(),
      paymentId: payment.id,
      userId,
    };

    return this.orderRepository.save(orderData);
  }

  async createOrderProductUsingCart(
    cart: CartEntity,
    orderId: number,
    products: ProductEntity[],
  ): Promise<OrderProductEntity[]> {
    if (!cart.cartProduct || cart.cartProduct.length === 0) {
      throw new NotFoundException('Cart has no products');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    return Promise.all(
      cart.cartProduct.map((cartProduct) => {
        const product = productMap.get(cartProduct.productId);

        if (!product) {
          throw new NotFoundException(
            `Product ${cartProduct.productId} not found`,
          );
        }

        return this.orderProductService.createOrderProduct(
          cartProduct.productId,
          orderId,
          product.price,
          cartProduct.amount,
        );
      }),
    );
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<OrderEntity> {
    const cart = await this.cartService.findCartByUserId(userId);

    if (!cart) {
      throw new NotFoundException(`Cart for userId: ${userId} not found`);
    }

    if (!cart.cartProduct || cart.cartProduct.length === 0) {
      throw new NotFoundException('Cart has no products');
    }

    const addresses = await this.addressService.findAddressByUserId(userId);

    if (!addresses || addresses.length === 0) {
      throw new NotFoundException('User has no registered addresses');
    }

    const address = addresses.find(
      (addr) => addr.id === createOrderDto.addressId,
    );

    if (!address) {
      throw new NotFoundException(
        `Address ${createOrderDto.addressId} not found for this user`,
      );
    }

    const productIds = cart.cartProduct.map((cp) => cp.productId);

    const products = await this.productService.findAllProductsById(productIds);

    const payment = await this.paymentService.createPayment(
      createOrderDto,
      products,
      cart,
    );

    const order = await this.saveOrder(createOrderDto, userId, payment);

    await this.createOrderProductUsingCart(cart, order.id, products);

    return order;
  }

  async findOrdersByUserId(userId: number): Promise<OrderEntity[]> {
    return this.orderRepository.find({
      where: {
        userId,
      },
      relations: {
        address: true,
        ordersProduct: {
          product: true,
        },
        payment: {
          paymentStatus: true,
        },
      },
    });
  }
}
