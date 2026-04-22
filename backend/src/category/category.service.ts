import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '@/category/entity/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ProductService } from '@/product/product.service';
import { ReturnCategoryDto } from './dto/return-category.dto';
import { CountProductDto } from '@/product/dto/countProduct.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly productService: ProductService,
  ) {}

  findAmountCategoryInProducts(
    category: CategoryEntity,
    countList: CountProductDto[],
  ): number {
    const count = countList.find(
      (itemCount) => itemCount.category_id === category.id,
    );

    if (count) {
      return count.total;
    }

    return 0;
  }

  async findAllCategories(): Promise<ReturnCategoryDto[]> {
    const categories = await this.categoryRepository.find();

    const count = await this.productService.countProdutsByCategoryId();

    return categories.map(
      (category) =>
        new ReturnCategoryDto(
          category,
          this.findAmountCategoryInProducts(category, count),
        ),
    );
  }

  async findCategoryByName(name: string): Promise<CategoryEntity | null> {
    return this.categoryRepository.findOne({
      where: { name: name },
    });
  }

  async findCategoryById(id: number): Promise<CategoryEntity | null> {
    return this.categoryRepository.findOne({
      where: { id: id },
    });
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const { name } = createCategoryDto;
    const category = await this.findCategoryByName(name);

    if (category) {
      throw new BadRequestException(`Category name ${name} exist`);
    }

    return this.categoryRepository.save(createCategoryDto);
  }
}
