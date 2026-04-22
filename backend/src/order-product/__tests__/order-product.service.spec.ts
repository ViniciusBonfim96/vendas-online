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
});
