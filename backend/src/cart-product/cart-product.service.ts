import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartProductEntity } from '@/cart-product/entity/cart-product.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InsertCardDto } from '@/cart/dto/insertCart.dto';
import { CartEntity } from '@/cart/entity/cart.entity';
import { ProductService } from '@/product/product.service';
import { UpdateCardDto } from '@/cart/dto/updateCart.dto';
import { ReturnCartDto } from '@/cart/dto/returnCart.dto';

@Injectable()
export class CartProductService {
  constructor(
    @InjectRepository(CartProductEntity)
    private readonly cartProductRepository: Repository<CartProductEntity>,
    private readonly productService: ProductService,
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
    const product = await this.productService.findProductById(
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

  async deleteProductCart(
    productId: number,
    cartId: number,
  ): Promise<DeleteResult> {
    return this.cartProductRepository.delete({ productId, cartId });
  }

  async updateProductInCart(
    updateCartDto: UpdateCardDto,
    cart: ReturnCartDto,
  ): Promise<void> {
    const product = await this.productService.findProductById(
      updateCartDto.productId,
    );

    if (!product) {
      throw new NotFoundException(
        `ProductId: ${updateCartDto.productId} not found`,
      );
    }

    const cartProduct = await this.verifyProductInCart(
      updateCartDto.productId,
      cart.id,
    );

    if (!cartProduct) {
      await this.createProductInCart(updateCartDto, cart.id);
      return;
    }

    const newamount = updateCartDto.amount;

    if (newamount < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    if (newamount === 0) {
      await this.cartProductRepository.remove(cartProduct);
      return;
    }

    await this.cartProductRepository.save({
      ...cartProduct,
      amount: newamount,
    });
  }
}
