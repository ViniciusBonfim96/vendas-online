import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from '@/product/product.service';
import { ReturnProductDto } from '@/product/dto/return-product.dto';
import { CreateProductDto } from '@/product/dto/create-product.dto';
import { ProductEntity } from '@/product/entity/product.entity';
import { Roles } from '@/decorators/roles.decorator';
import { UserType } from '@/user/enum/user-type.enum';
import { DeleteResult } from 'typeorm';

@Roles(UserType.Admin, UserType.User)
@Controller('product')
export class ProductController {
  constructor(private readonly productServervice: ProductService) {}

  @Get()
  async findAllProducts(): Promise<ReturnProductDto[]> {
    const products = await this.productServervice.findAllProducts();

    return products.map((product) => new ReturnProductDto(product));
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productServervice.createProduct(createProductDto);
  }

  @Roles(UserType.Admin)
  @Delete('/:productId')
  async deleteProduct(
    @Param('productId') productId: number,
  ): Promise<DeleteResult> {
    return this.productServervice.deleteProduct(productId);
  }
}
