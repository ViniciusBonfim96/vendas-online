import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '@/order/order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderEntity } from '@/order/entity/order.entity';
import { Repository } from 'typeorm';
import { PaymentService } from '@/payment/payment.service';
import { CartService } from '@/cart/cart.service';
import { OrderProductService } from '@/order-product/order-product.service';
import { AddressService } from '@/address/address.service';
import { ProductService } from '@/product/product.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { orderEntityMock } from '../__mocks__/order.mock';
import { paymentEntityMock } from '@/payment/__mocks__/payment.mock';
import { cartEntityMock } from '@/cart/__mocks__/cart.mock';
import { addressEntityMock } from '@/address/__mocks__/address.mock';
import { productEntityMock } from '@/product/__mocks__/product.mock';
import { createOrderMock } from '../__mocks__/createOrder.mock';
import { userEntityMock } from '@/user/__mocks__/user.mock';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<OrderEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(orderEntityMock),
            find: jest.fn().mockResolvedValue([orderEntityMock]),
          },
        },
        {
          provide: PaymentService,
          useValue: {
            createPayment: jest.fn().mockResolvedValue(paymentEntityMock),
          },
        },
        {
          provide: CartService,
          useValue: {
            findCartByUserId: jest.fn().mockResolvedValue(cartEntityMock),
          },
        },
        {
          provide: OrderProductService,
          useValue: {
            createOrderProduct: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: AddressService,
          useValue: {
            findAddressByUserId: jest
              .fn()
              .mockResolvedValue([addressEntityMock]),
          },
        },
        {
          provide: ProductService,
          useValue: {
            findAllProductsById: jest
              .fn()
              .mockResolvedValue([productEntityMock]),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get(getRepositoryToken(OrderEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(orderRepository).toBeDefined();
  });

  /* =======================
     CREATE ORDER
  ======================= */

  it('should create order successfully', async () => {
    const result = await service.createOrder(
      createOrderMock,
      userEntityMock.id,
    );

    expect(result).toEqual(orderEntityMock);
    expect(orderRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw if cart not found', async () => {
    const cartService = service['cartService'];
    cartService.findCartByUserId = jest.fn().mockResolvedValue(null);

    await expect(
      service.createOrder(createOrderMock, userEntityMock.id),
    ).rejects.toThrow(
      new NotFoundException(`Cart for userId: ${userEntityMock.id} not found`),
    );
  });

  it('should throw if address not found for user', async () => {
    const addressService = service['addressService'];
    addressService.findAddressByUserId = jest.fn().mockResolvedValue([]);

    await expect(
      service.createOrder(createOrderMock, userEntityMock.id),
    ).rejects.toThrow(
      new NotFoundException('User has no registered addresses'),
    );
  });

  it('should save order', async () => {
    const result = await service.saveOrder(
      createOrderMock,
      userEntityMock.id,
      paymentEntityMock,
    );

    expect(orderRepository.save).toHaveBeenCalled();
    expect(result).toEqual(orderEntityMock);
  });

  it('should throw if payment invalid', async () => {
    await expect(
      service.saveOrder(createOrderMock, userEntityMock.id, {} as any),
    ).rejects.toThrow(new BadRequestException('Invalid payment'));
  });

  it('should create order products from cart', async () => {
    const result = await service.createOrderProductUsingCart(
      cartEntityMock,
      orderEntityMock.id,
      [productEntityMock],
    );

    expect(result).toBeDefined();
  });

  it('should throw if cart has no products', async () => {
    await expect(
      service.createOrderProductUsingCart(
        { cartProduct: [] } as any,
        orderEntityMock.id,
        [],
      ),
    ).rejects.toThrow(new NotFoundException('Cart has no products'));
  });

  it('should find orders by userId', async () => {
    const result = await service.findOrdersByUserId(userEntityMock.id);

    expect(orderRepository.find).toHaveBeenCalledWith({
      where: { userId: userEntityMock.id },
      relations: expect.any(Object),
    });

    expect(result).toEqual([orderEntityMock]);
  });

  it('should return all orders with user relation', async () => {
    const orderMock = [
      {
        id: 1,
        total: 100,
        date: new Date(),
        user: {
          id: 1,
          name: 'User Mock',
        },
      },
    ] as any; // <- evita erro de tipo do OrderEntity

    jest.spyOn(orderRepository, 'find').mockResolvedValueOnce(orderMock);

    const result = await service.findAllOrders();

    expect(orderRepository.find).toHaveBeenCalledWith({
      relations: {
        user: true,
      },
    });

    expect(result).toEqual(orderMock);
  });
});
