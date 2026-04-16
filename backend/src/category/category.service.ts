import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '@/category/entity/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAllCategories(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find();
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
