import { Repository } from 'typeorm';
import { ProductService } from '@/product/product.service';
import { ProductEntity } from '@/product/entity/product.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productEntityMock } from '@/product/__mocks__/product.mock';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([productEntityMock]),
            save: jest.fn().mockResolvedValue(productEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  it('should return list product', async () => {
    const product = await service.findAllProducts();

    expect(productRepository.find).toHaveBeenCalled();
    expect(product).toEqual([productEntityMock]);
  });

  it('should return error in list product empty', async () => {
    jest.spyOn(productRepository, 'find').mockResolvedValueOnce([]);

    const category = await service.findAllProducts();

    expect(category).toEqual([]);
  });

  it('should return error in list product exception', async () => {
    jest.spyOn(productRepository, 'find').mockRejectedValueOnce(new Error());

    await expect(service.findAllProducts()).rejects.toThrow();
  });
});
