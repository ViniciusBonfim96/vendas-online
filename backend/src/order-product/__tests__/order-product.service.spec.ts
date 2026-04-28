import { Test, TestingModule } from '@nestjs/testing';
import { OrderProductService } from '@/order-product/order-product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderProductEntity } from '@/order-product/entity/orderProduct.entity';
import { Repository } from 'typeorm';
import { orderProductEntityMock } from '@/order-product/__mocks__/orderProduct.mock';

describe('OrderProductService', () => {
  let service: OrderProductService;
  let orderProductRepository: Repository<OrderProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderProductService,
        {
          provide: getRepositoryToken(OrderProductEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(orderProductEntityMock),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderProductService>(OrderProductService);
    orderProductRepository = module.get(getRepositoryToken(OrderProductEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(orderProductRepository).toBeDefined();
  });

  describe('createOrderProduct', () => {
    it('should create order product successfully', async () => {
      const result = await service.createOrderProduct(1, 1, 100, 2);

      expect(orderProductRepository.save).toHaveBeenCalledTimes(1);

      expect(orderProductRepository.save).toHaveBeenCalledWith({
        productId: 1,
        orderId: 1,
        price: 100,
        amount: 2,
      });

      expect(result).toEqual(orderProductEntityMock);
    });

    it('should call save with correct values', async () => {
      await service.createOrderProduct(2, 3, 50, 5);

      const savedArg = (orderProductRepository.save as jest.Mock).mock
        .calls[0][0];

      expect(savedArg.productId).toBe(2);
      expect(savedArg.orderId).toBe(3);
      expect(savedArg.price).toBe(50);
      expect(savedArg.amount).toBe(5);
    });

    it('should return saved entity', async () => {
      const result = await service.createOrderProduct(1, 1, 100, 2);

      expect(result).toBe(orderProductEntityMock);
    });
  });

  it('should return empty array if orderId is empty', async () => {
    const result = await service.findAmountProductsByOrderId([]);

    expect(result).toEqual([]);
    expect(orderProductRepository.createQueryBuilder).not.toHaveBeenCalled();
  });

  it('should build query and return grouped result', async () => {
    const mockResult = [
      { order_id: 1, total: '3' },
      { order_id: 2, total: '5' },
    ];

    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(mockResult),
    };

    jest
      .spyOn(orderProductRepository, 'createQueryBuilder')
      .mockReturnValue(mockQueryBuilder as any);

    const result = await service.findAmountProductsByOrderId([1, 2]);

    expect(orderProductRepository.createQueryBuilder).toHaveBeenCalledWith(
      'order_product',
    );

    expect(mockQueryBuilder.select).toHaveBeenCalledWith(
      'order_product.orderId',
      'order_id',
    );

    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(
      'COUNT(*)',
      'total',
    );

    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'order_product.orderId IN (:...ids)',
      { ids: [1, 2] },
    );

    expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith(
      'order_product.orderId',
    );

    expect(result).toEqual(mockResult);
  });

  it('should throw if query fails', async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockRejectedValue(new Error('DB error')),
    };

    jest
      .spyOn(orderProductRepository, 'createQueryBuilder')
      .mockReturnValue(mockQueryBuilder as any);

    await expect(service.findAmountProductsByOrderId([1])).rejects.toThrow(
      'DB error',
    );
  });
});
