import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '@/category/category.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '@/category/entity/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryEntityMock } from '@/category/__mocks__/category.mock';
import { createCategoryMock } from '@/category/__mocks__/createCategory.mock';
import { ProductService } from '@/product/product.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([categoryEntityMock]),
            findOne: jest.fn().mockResolvedValue(categoryEntityMock),
            save: jest.fn().mockResolvedValue(categoryEntityMock),
          },
        },
        {
          provide: ProductService,
          useValue: {
            countProdutsByCategoryId: jest.fn().mockResolvedValue([
              {
                category_id: categoryEntityMock.id,
                total: 5,
              },
            ]),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
    productService = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
    expect(productService).toBeDefined();
  });

  it('should return list of categories', async () => {
    const result = await service.findAllCategories();

    expect(categoryRepository.find).toHaveBeenCalled();
    expect(productService.countProdutsByCategoryId).toHaveBeenCalled();
    expect(result.length).toBe(1);
  });

  it('should return empty list when no categories exist', async () => {
    jest.spyOn(categoryRepository, 'find').mockResolvedValueOnce([]);

    const result = await service.findAllCategories();

    expect(result).toEqual([]);
  });

  it('should throw error when repository fails on findAllCategories', async () => {
    jest
      .spyOn(categoryRepository, 'find')
      .mockRejectedValueOnce(new Error('Database error'));

    await expect(service.findAllCategories()).rejects.toThrow('Database error');
  });

  it('should return category by name', async () => {
    const result = await service.findCategoryByName(categoryEntityMock.name);

    expect(categoryRepository.findOne).toHaveBeenCalledWith({
      where: { name: categoryEntityMock.name },
    });

    expect(result).toEqual(categoryEntityMock);
  });

  it('should return null when category by name does not exist', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null);

    const result = await service.findCategoryByName(categoryEntityMock.name);

    expect(result).toBeNull();
  });

  it('should throw error when DB fails on findCategoryByName', async () => {
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockRejectedValueOnce(new Error('Database error'));

    await expect(
      service.findCategoryByName(categoryEntityMock.name),
    ).rejects.toThrow('Database error');
  });

  it('should create category when it does not exist', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null);

    const result = await service.createCategory(createCategoryMock);

    expect(categoryRepository.save).toHaveBeenCalledWith(createCategoryMock);
    expect(result).toEqual(categoryEntityMock);
  });

  it('should throw error when category already exists', async () => {
    await expect(service.createCategory(createCategoryMock)).rejects.toThrow(
      `Category name ${createCategoryMock.name} exist`,
    );
  });

  it('should return category by id', async () => {
    const result = await service.findCategoryById(categoryEntityMock.id);

    expect(categoryRepository.findOne).toHaveBeenCalledWith({
      where: { id: categoryEntityMock.id },
    });

    expect(result).toEqual(categoryEntityMock);
  });

  it('should return null when category by id does not exist', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null);

    const result = await service.findCategoryById(categoryEntityMock.id);

    expect(result).toBeNull();
  });

  it('should throw error when DB fails on findCategoryById', async () => {
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockRejectedValueOnce(new Error('Database error'));

    await expect(
      service.findCategoryById(categoryEntityMock.id),
    ).rejects.toThrow('Database error');
  });
});
