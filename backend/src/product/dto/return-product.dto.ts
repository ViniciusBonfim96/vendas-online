import { ReturnCategoryDto } from '@/category/dto/return-category.dto';
import { ProductEntity } from '@/product/entity/product.entity';

export class ReturnProductDto {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: ReturnCategoryDto;

  constructor(productEntity: ProductEntity) {
    this.id = productEntity.id;
    this.name = productEntity.name;
    this.price = productEntity.price;
    this.image = productEntity.image;
    this.category = productEntity.category
      ? new ReturnCategoryDto(productEntity.category)
      : undefined;
  }
}
