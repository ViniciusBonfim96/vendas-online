import { Controller, Get } from '@nestjs/common';
import { ProductService } from '@/product/product.service';
import { ReturnProductDto } from '@/product/dto/return-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productServer: ProductService) {}

  @Get()
  async findAllProducts(): Promise<ReturnProductDto[]> {
    const products = await this.productServer.findAllProducts();

    return products.map((product) => new ReturnProductDto(product));
  }
}
