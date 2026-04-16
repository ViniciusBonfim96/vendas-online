import { Repository } from 'typeorm';
import { ProductService } from '@/product/product.service';
import { ProductEntity } from '@/product/entity/product.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productEntityMock } from '@/product/__mocks__/product.mock';
import { createProductMock } from '@/product/__mocks__/create-product.mock';
import { CategoryService } from '@/category/category.service';
import { categoryEntityMock } from '@/category/__mocks__/category.mock';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([productEntityMock]),
            findOne: jest.fn().mockResolvedValue(productEntityMock),
            save: jest.fn().mockResolvedValue(productEntityMock),
          },
        },
        {
          provide: CategoryService,
          useValue: {
            findCategoryById: jest.fn().mockResolvedValue(categoryEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
    categoryService = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  it('should return list of products', async () => {
    const product = await service.findAllProducts();

    expect(productRepository.find).toHaveBeenCalled();
    expect(product).toEqual([productEntityMock]);
  });

  it('should return empty list when no products exist', async () => {
    jest.spyOn(productRepository, 'find').mockResolvedValueOnce([]);

    const product = await service.findAllProducts();

    expect(product).toEqual([]);
  });

  it('should throw error when repository fails on findAllProducts', async () => {
    jest
      .spyOn(productRepository, 'find')
      .mockRejectedValueOnce(new Error('Database error'));

    await expect(service.findAllProducts()).rejects.toThrow('Database error');
  });

  it('should create product when it does not exist', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(null);

    const product = await service.createProduct(createProductMock);

    expect(categoryService.findCategoryById).toHaveBeenCalledWith(
      createProductMock.categoryId,
    );

    expect(productRepository.findOne).toHaveBeenCalledWith({
      where: { name: createProductMock.name },
    });

    expect(productRepository.save).toHaveBeenCalledWith(createProductMock);

    expect(product).toEqual(productEntityMock);
  });

  it('should throw NotFoundException when category does not exist', async () => {
    jest.spyOn(categoryService, 'findCategoryById').mockResolvedValueOnce(null);

    await expect(service.createProduct(createProductMock)).rejects.toThrow(
      `categoryId: ${createProductMock.categoryId} not found`,
    );

    expect(productRepository.findOne).not.toHaveBeenCalled();
    expect(productRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when product already exists', async () => {
    await expect(service.createProduct(createProductMock)).rejects.toThrow(
      `product name: ${productEntityMock} already exists`,
    );

    expect(productRepository.findOne).toHaveBeenCalledWith({
      where: { name: createProductMock.name },
    });

    expect(productRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when save fails', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(null);

    jest
      .spyOn(productRepository, 'save')
      .mockRejectedValueOnce(new Error('Database error'));

    await expect(service.createProduct(createProductMock)).rejects.toThrow(
      'Database error',
    );
  });
});
