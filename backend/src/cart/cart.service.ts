import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from '@/cart/entity/cart.entity';
import { Repository } from 'typeorm';
import { InsertCardDto } from '@/cart/dto/insertCart.dto';
import { CartProductService } from '@/cart-product/cart-product.service';
import { DeleteResult } from 'typeorm/browser';
import { ProductService } from '@/product/product.service';
import { UpdateCardDto } from '@/cart/dto/updateCart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    private readonly cartProductService: CartProductService,
    private readonly productService: ProductService,
  ) {}

  async findCartByUserId(userId: number): Promise<CartEntity | null> {
    return this.cartRepository.findOne({
      where: { userId: userId, active: true },
      relations: { cartProduct: { product: true } },
    });
  }

  async createCart(userId: number): Promise<CartEntity> {
    return this.cartRepository.save({
      active: true,
      userId,
    });
  }

  async insertProductInCart(
    insertCardDto: InsertCardDto,
    userId: number,
  ): Promise<CartEntity> {
    let cart = await this.findCartByUserId(userId);

    if (!cart) {
      cart = await this.createCart(userId);
    }

    await this.cartProductService.insertProductInCart(insertCardDto, cart);

    return cart;
  }

  async clearCart(userId: number) {
    let cart = await this.findCartByUserId(userId);

    if (!cart) {
      throw new NotFoundException(`CartId: ${userId} not found`);
    }

    await this.cartRepository.save({
      ...cart,
      active: false,
    });
  }

  async deleteProductCart(
    productId: number,
    userId: number,
  ): Promise<DeleteResult> {
    let cart = await this.findCartByUserId(userId);

    if (!cart) {
      throw new NotFoundException(`CartId: ${userId} not found`);
    }

    let product = await this.productService.findProductById(productId);

    if (!product) {
      throw new NotFoundException(`ProductId: ${productId} not found`);
    }

    return this.cartProductService.deleteProductCart(productId, cart.id);
  }

  async updateProductInCart(
    updateCartDto: UpdateCardDto,
    userId: number,
  ): Promise<CartEntity | null> {
    const cart = await this.findCartByUserId(userId);

    if (!cart) {
      throw new NotFoundException(`Cart for userId: ${userId} not found`);
    }

    await this.cartProductService.updateProductInCart(updateCartDto, cart);

    const updatedCart = await this.findCartByUserId(userId);

    return updatedCart;
  }
}
