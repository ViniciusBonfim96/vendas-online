import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '@/product/entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoryService } from '@/category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoryService,
  ) {}

  async findAllProducts(): Promise<ProductEntity[]> {
    return this.productRepository.find();
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const { categoryId, name } = createProductDto;

    const category = await this.categoryService.findCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException(`categoryId: ${categoryId} not found`);
    }

    const productExist = await this.productRepository.findOne({
      where: { name: name },
    });

    if (productExist) {
      throw new NotFoundException(
        `product name: ${productExist} already exists`,
      );
    }

    return this.productRepository.save(createProductDto);
  }
}
