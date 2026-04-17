import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from '@/cart/entity/cart.entity';
import { Repository } from 'typeorm';
import { InsertCardDto } from './dto/insertCart.dto';
import { CartProductService } from '@/cart-product/cart-product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    private readonly cartProductServer: CartProductService,
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

    await this.cartProductServer.insertProductInCart(insertCardDto, cart);

    return cart;
  }
}
