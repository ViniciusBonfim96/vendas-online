import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '@/category/category.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '@/category/entity/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryEntityMock } from '@/category/__mocks__/category.mock';
import { createCategoryMock } from '@/category/__mocks__/create-category.mock';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([categoryEntityMock]),
            save: jest.fn().mockResolvedValue(categoryEntityMock),
            findOne: jest.fn().mockResolvedValue(categoryEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  it('should return list category', async () => {
    const categories = await service.findAllCategories();

    expect(categoryRepository.find).toHaveBeenCalled();
    expect(categories).toEqual([categoryEntityMock]);
  });

  it('should return error in list category empty', async () => {
    jest.spyOn(categoryRepository, 'find').mockResolvedValueOnce([]);

    const category = await service.findAllCategories();

    expect(category).toEqual([]);
  });

  it('should return error in list category exception', async () => {
    jest.spyOn(categoryRepository, 'find').mockRejectedValueOnce(new Error());

    await expect(service.findAllCategories()).rejects.toThrow();
  });

  it('should return category in findCategoryByName', async () => {
    const category = await service.findCategoryByName(categoryEntityMock.name);

    expect(categoryRepository.findOne).toHaveBeenCalledWith({
      where: { name: categoryEntityMock.name },
    });
    expect(category).toEqual(categoryEntityMock);
  });

  it('should return category null in findCategoryByName', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null);

    const category = await service.findCategoryByName(categoryEntityMock.name);

    expect(categoryRepository.findOne).toHaveBeenCalledWith({
      where: { name: categoryEntityMock.name },
    });
    expect(category).toBeNull();
  });

  it('should return error category in findCategoryByName', async () => {
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockRejectedValueOnce(new Error());

    await expect(
      service.findCategoryByName(categoryEntityMock.name),
    ).rejects.toThrow();
  });

  it('should create category when it does not exist', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null);
    const category = await service.createCategory(createCategoryMock);

    expect(categoryRepository.findOne).toHaveBeenCalledWith({
      where: { name: categoryEntityMock.name },
    });

    expect(categoryRepository.save).toHaveBeenCalled();
    expect(category).toEqual(categoryEntityMock);
  });

  it('should return error if category exist', async () => {
    await expect(service.createCategory(createCategoryMock)).rejects.toThrow();
  });
});
