import { Module } from '@nestjs/common';
import { ProductController } from '@/product/product.controller';
import { ProductService } from '@/product/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@/product/entity/product.entity';
import { CategoryModule } from '@/category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), CategoryModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
