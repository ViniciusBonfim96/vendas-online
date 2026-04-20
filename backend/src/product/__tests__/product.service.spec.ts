import { DeleteResult, Repository } from 'typeorm';
import { ProductService } from '@/product/product.service';
import { ProductEntity } from '@/product/entity/product.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productEntityMock } from '@/product/__mocks__/product.mock';
import { createProductMock } from '@/product/__mocks__/createProduct.mock';
import { CategoryService } from '@/category/category.service';
import { categoryEntityMock } from '@/category/__mocks__/category.mock';
import { returnDeleteMock } from '@/product/__mocks__/returnDelete.mock';
import { updateProductMock } from '@/product/__mocks__/updateProduct.mock';

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
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
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

  it('should throw error when product already exists', async () => {
    jest
      .spyOn(productRepository, 'findOne')
      .mockResolvedValueOnce(productEntityMock);

    await expect(service.createProduct(createProductMock)).rejects.toThrow(
      `product name: ${createProductMock.name} already exists`,
    );

    expect(productRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when product already exists', async () => {
    await expect(service.createProduct(createProductMock)).rejects.toThrow(
      `product name: ${productEntityMock.name} already exists`,
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

  it('should return product by id', async () => {
    const product = await service.findProductById(productEntityMock.id);

    expect(productRepository.findOne).toHaveBeenCalledWith({
      where: { id: productEntityMock.id },
    });
    expect(product).toEqual(productEntityMock);
  });

  it('should throw error when product not found', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(null);

    const product = await service.findProductById(productEntityMock.id);

    expect(productRepository.findOne).toHaveBeenCalledWith({
      where: { id: productEntityMock.id },
    });

    expect(product).toBeNull();
  });

  it('should throw error when repository fails on findProductById', async () => {
    jest
      .spyOn(productRepository, 'findOne')
      .mockRejectedValueOnce(new Error('DB error'));

    await expect(service.findProductById(productEntityMock.id)).rejects.toThrow(
      'DB error',
    );

    expect(productRepository.findOne).toHaveBeenCalledWith({
      where: { id: productEntityMock.id },
    });
  });

  it('should delete product successfully', async () => {
    const product = await service.deleteProduct(productEntityMock.id);

    expect(productRepository.delete).toHaveBeenCalledWith({
      id: productEntityMock.id,
    });

    expect(product).toEqual(returnDeleteMock);
  });

  it('should throw error when product not found on delete', async () => {
    jest
      .spyOn(productRepository, 'delete')
      .mockResolvedValueOnce({ affected: 0 } as DeleteResult);

    await expect(service.deleteProduct(productEntityMock.id)).rejects.toThrow(
      `ProductId: ${productEntityMock.id} not found`,
    );

    expect(productRepository.delete).toHaveBeenCalledWith({
      id: productEntityMock.id,
    });
  });

  it('should throw error when repository fails on delete', async () => {
    jest
      .spyOn(productRepository, 'delete')
      .mockRejectedValueOnce(new Error('DB error'));

    await expect(service.deleteProduct(productEntityMock.id)).rejects.toThrow(
      'DB error',
    );

    expect(productRepository.delete).toHaveBeenCalledWith({
      id: productEntityMock.id,
    });
  });

  it('should update product successfully with categoryId', async () => {
    jest
      .spyOn(categoryService, 'findCategoryById')
      .mockResolvedValueOnce(categoryEntityMock);

    jest
      .spyOn(productRepository, 'findOne')
      .mockResolvedValueOnce(productEntityMock);

    const result = await service.updateProduct(
      updateProductMock,
      productEntityMock.id,
    );

    expect(categoryService.findCategoryById).toHaveBeenCalledWith(
      updateProductMock.categoryId,
    );

    expect(productRepository.findOne).toHaveBeenCalledWith({
      where: { id: productEntityMock.id },
    });

    expect(productRepository.save).toHaveBeenCalledWith({
      ...productEntityMock,
      ...updateProductMock,
    });

    expect(result).toEqual(productEntityMock);
  });

  it('should update product successfully without categoryId', async () => {
    const dto = { ...updateProductMock, categoryId: undefined };

    jest
      .spyOn(productRepository, 'findOne')
      .mockResolvedValueOnce(productEntityMock);

    const result = await service.updateProduct(dto, productEntityMock.id);

    expect(categoryService.findCategoryById).not.toHaveBeenCalled();

    expect(productRepository.findOne).toHaveBeenCalledWith({
      where: { id: productEntityMock.id },
    });

    expect(productRepository.save).toHaveBeenCalledWith({
      ...productEntityMock,
      ...dto,
    });

    expect(result).toEqual(productEntityMock);
  });

  it('should throw error when category not found on update', async () => {
    jest.spyOn(categoryService, 'findCategoryById').mockResolvedValueOnce(null);

    await expect(
      service.updateProduct(updateProductMock, productEntityMock.id),
    ).rejects.toThrow(`categoryId: ${updateProductMock.categoryId} not found`);

    expect(productRepository.findOne).not.toHaveBeenCalled();
    expect(productRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when product not found on update', async () => {
    jest
      .spyOn(categoryService, 'findCategoryById')
      .mockResolvedValueOnce(categoryEntityMock);

    jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(
      service.updateProduct(updateProductMock, productEntityMock.id),
    ).rejects.toThrow(`ProductId: ${productEntityMock.id} not found`);

    expect(productRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when repository fails on update', async () => {
    jest
      .spyOn(categoryService, 'findCategoryById')
      .mockResolvedValueOnce(categoryEntityMock);

    jest
      .spyOn(productRepository, 'findOne')
      .mockResolvedValueOnce(productEntityMock);

    jest
      .spyOn(productRepository, 'save')
      .mockRejectedValueOnce(new Error('DB error'));

    await expect(
      service.updateProduct(updateProductMock, productEntityMock.id),
    ).rejects.toThrow('DB error');

    expect(productRepository.save).toHaveBeenCalledWith({
      ...productEntityMock,
      ...updateProductMock,
    });
  });
});
