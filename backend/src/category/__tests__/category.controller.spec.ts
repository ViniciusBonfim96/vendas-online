import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '@/category/category.controller';
import { CategoryService } from '@/category/category.service';
import { categoryEntityMock } from '@/category/__mocks__/category.mock';
import { createCategoryMock } from '@/category/__mocks__/createCategory.mock';

describe('CategoryController', () => {
  let controller: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            findAllCategories: jest
              .fn()
              .mockResolvedValue([categoryEntityMock]),
            createCategory: jest.fn().mockResolvedValue(categoryEntityMock),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all categories', async () => {
    const result = await controller.findAllCategories();

    expect(categoryService.findAllCategories).toHaveBeenCalled();

    // ✅ agora está correto (ARRAY)
    expect(result).toEqual([categoryEntityMock]);
  });

  it('should throw error when service fails on findAllCategories', async () => {
    jest
      .spyOn(categoryService, 'findAllCategories')
      .mockRejectedValueOnce(new Error('DB error'));

    await expect(controller.findAllCategories()).rejects.toThrow('DB error');
  });

  it('should create category', async () => {
    const result = await controller.createCategory(createCategoryMock);

    expect(categoryService.createCategory).toHaveBeenCalledWith(
      createCategoryMock,
    );

    expect(result).toEqual(categoryEntityMock);
  });

  it('should throw error when service fails on createCategory', async () => {
    jest
      .spyOn(categoryService, 'createCategory')
      .mockRejectedValueOnce(new Error('error'));

    await expect(controller.createCategory(createCategoryMock)).rejects.toThrow(
      'error',
    );
  });
});
