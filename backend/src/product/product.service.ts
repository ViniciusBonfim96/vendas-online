import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '@/product/entity/product.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateProductDto } from '@/product/dto/create-product.dto';
import { CategoryService } from '@/category/category.service';
import { UpdateProductDto } from '@/product/dto/update-product.dto';

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

  async findProductById(productId: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product id: ${productId} not found`);
    }

    return product;
  }

  async deleteProduct(productId: number): Promise<DeleteResult> {
    const result = await this.productRepository.delete({ id: productId });

    if (!result.affected) {
      throw new NotFoundException(`Product id: ${productId} not found`);
    }

    return result;
  }

  async updateProduct(
    updateProductDto: UpdateProductDto,
    productId: number,
  ): Promise<ProductEntity> {
    if (updateProductDto.categoryId) {
      const category = await this.categoryService.findCategoryById(
        updateProductDto.categoryId,
      );

      if (!category) {
        throw new NotFoundException(
          `category id: ${updateProductDto.categoryId} not found`,
        );
      }
    }

    const product = await this.findProductById(productId);

    return this.productRepository.save({
      ...product,
      ...updateProductDto,
    });
  }
}
