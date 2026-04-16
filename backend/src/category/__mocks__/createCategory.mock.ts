import { CreateCategoryDto } from '@/category/dto/create-category.dto';
import { categoryEntityMock } from '@/category/__mocks__/category.mock';

export const createCategoryMock: CreateCategoryDto = {
  name: categoryEntityMock.name,
};
