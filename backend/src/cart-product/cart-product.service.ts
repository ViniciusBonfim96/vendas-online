import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartProductEntity } from '@/cart-product/entity/cart-product.entity';
import { Repository } from 'typeorm';
import { InsertCardDto } from '@/cart/dto/insertCart.dto';
import { CartEntity } from '@/cart/entity/cart.entity';
import { ProductService } from '@/product/product.service';

@Injectable()
export class CartProductService {
  constructor(
    @InjectRepository(CartProductEntity)
    private readonly cartProductRepository: Repository<CartProductEntity>,
    private readonly productServer: ProductService,
  ) {}

  async verifyProductInCart(
    productId: number,
    cartId: number,
  ): Promise<CartProductEntity | null> {
    return this.cartProductRepository.findOne({
      where: {
        productId,
        cartId,
      },
    });
  }

  async createProductInCart(
    insertCardDto: InsertCardDto,
    cartId: number,
  ): Promise<CartProductEntity> {
    return this.cartProductRepository.save({
      amount: insertCardDto.amount,
      productId: insertCardDto.productId,
      cartId,
    });
  }

  async insertProductInCart(insertCardDto: InsertCardDto, cart: CartEntity) {
    const product = await this.productServer.findProductById(
      insertCardDto.productId,
    );

    if (!product) {
      throw new NotFoundException(
        `ProductId: ${insertCardDto.productId} not found`,
      );
    }

    const cartProduct = await this.verifyProductInCart(
      insertCardDto.productId,
      cart.id,
    );

    if (!cartProduct) {
      return this.createProductInCart(insertCardDto, cart.id);
    }

    return this.cartProductRepository.save({
      ...cartProduct,
      amount: cartProduct.amount + insertCardDto.amount,
    });
  }
}
