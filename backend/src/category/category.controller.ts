import { Controller, Get } from '@nestjs/common';
import { CategoryService } from '@/category/category.service';
import { ReturnCategoryDto } from '@/category/dto/return-category.dto';
import { Roles } from '@/decorators/roles.decorator';
import { UserType } from '@/user/enum/user-type.enum';

@Roles(UserType.Admin, UserType.User)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAllCategories(): Promise<ReturnCategoryDto[]> {
    const categories = await this.categoryService.findAllCategories();

    return categories.map((categories) => new ReturnCategoryDto(categories));
  }
}
