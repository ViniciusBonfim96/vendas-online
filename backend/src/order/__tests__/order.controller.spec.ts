import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '@/order/order.controller';
import { OrderService } from '@/order/order.service';
import { orderEntityMock } from '../__mocks__/order.mock';
import { createOrderMock } from '../__mocks__/createOrder.mock';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn().mockResolvedValue(orderEntityMock),
            findOrdersByUserId: jest.fn().mockResolvedValue([orderEntityMock]),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(orderService).toBeDefined();
  });

  /* =======================
     CREATE ORDER
  ======================= */

  it('should create order', async () => {
    const result = await controller.createOrder(createOrderMock, 1);

    expect(orderService.createOrder).toHaveBeenCalledWith(createOrderMock, 1);

    expect(result).toEqual(orderEntityMock);
  });

  /* =======================
     FIND ORDERS
  ======================= */

  it('should return orders by userId', async () => {
    const result = await controller.findOrdersByUserId(1);

    expect(orderService.findOrdersByUserId).toHaveBeenCalledWith(1);
    expect(result).toEqual([orderEntityMock]);
  });

  it('should return empty array if no orders found', async () => {
    (orderService.findOrdersByUserId as jest.Mock).mockResolvedValueOnce([]);

    const result = await controller.findOrdersByUserId(1);

    expect(result).toEqual([]);
  });
});
