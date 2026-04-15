import { Module } from '@nestjs/common';
import { ProductController } from '@/product/product.controller';
import { ProductService } from '@/product/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@/product/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
