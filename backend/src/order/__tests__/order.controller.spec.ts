import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '@/order/order.controller';
import { OrderService } from '@/order/order.service';
import { orderEntityMock } from '@/order/__mocks__/order.mock';
import { createOrderMock } from '@/order/__mocks__/createOrder.mock';
import { ReturnOrderDto } from '@/order/dto/returnOrder.dto';

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
            findOrderById: jest.fn().mockResolvedValue(orderEntityMock),
            findAllOrders: jest.fn(),
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

  it('should create order', async () => {
    const result = await controller.createOrder(createOrderMock, 1);

    expect(orderService.createOrder).toHaveBeenCalledWith(createOrderMock, 1);

    expect(result).toEqual(orderEntityMock);
  });

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

  it('should return all orders mapped to ReturnOrderDto', async () => {
    const orderMock = [
      {
        id: 1,
        date: new Date(),
        user: {
          id: 1,
          name: 'User Mock',
        },
      },
    ];

    const serviceResultMock = orderMock as any;

    (orderService.findAllOrders as jest.Mock).mockResolvedValueOnce(
      serviceResultMock,
    );

    const result = await controller.findAllOrders();

    expect(orderService.findAllOrders).toHaveBeenCalled();

    expect(result).toEqual([
      expect.objectContaining({
        id: 1,
        user: expect.objectContaining({
          id: 1,
          name: 'User Mock',
        }),
      }),
    ]);
  });

  describe('findOrderById', () => {
    it('should return order by id', async () => {
      const result = await controller.findOrderById(orderEntityMock.id);

      expect(orderService.findOrderById).toHaveBeenCalledWith(
        orderEntityMock.id,
      );

      expect(result).toEqual(new ReturnOrderDto(orderEntityMock));
    });

    it('should throw NotFoundException when order not found', async () => {
      jest.spyOn(orderService, 'findOrderById').mockResolvedValueOnce(null);

      await expect(
        controller.findOrderById(orderEntityMock.id),
      ).rejects.toThrow(`orderId: ${orderEntityMock.id} not found`);

      expect(orderService.findOrderById).toHaveBeenCalledWith(
        orderEntityMock.id,
      );
    });

    it('should throw error when service fails', async () => {
      jest
        .spyOn(orderService, 'findOrderById')
        .mockRejectedValueOnce(new Error('DB error'));

      await expect(
        controller.findOrderById(orderEntityMock.id),
      ).rejects.toThrow('DB error');

      expect(orderService.findOrderById).toHaveBeenCalledWith(
        orderEntityMock.id,
      );
    });
  });
});
