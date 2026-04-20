import { Roles } from '@/decorators/roles.decorator';
import { UserType } from '@/user/enum/user-type.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CartService } from '@/cart/cart.service';
import { UserId } from '@/decorators/user-id-decorator';
import { InsertCardDto } from '@/cart/dto/insertCart.dto';
import { ReturnCartDto } from '@/cart/dto/returnCart.dto';
import { DeleteResult } from 'typeorm';
import { UpdateCardDto } from '@/cart/dto/updateCart.dto';

@Roles(UserType.User, UserType.Admin)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async createCart(
    @Body() insertCardDto: InsertCardDto,
    @UserId() userId: number,
  ): Promise<ReturnCartDto> {
    return new ReturnCartDto(
      await this.cartService.insertProductInCart(insertCardDto, userId),
    );
  }

  @Get()
  async findCartByUserId(@UserId() userId: number): Promise<ReturnCartDto> {
    const cart = await this.cartService.findCartByUserId(userId);

    if (!cart) {
      throw new NotFoundException(`Cart for userId: ${userId} not found`);
    }

    return new ReturnCartDto(cart);
  }

  @Delete()
  async clearCart(@UserId() userId: number) {
    await this.cartService.clearCart(userId);

    return { message: 'Cart cleared successfully' };
  }

  @Delete('/product/:productId')
  async deleteProductCart(
    @Param('productId') productId: number,
    @UserId() userId: number,
  ): Promise<DeleteResult> {
    return this.cartService.deleteProductCart(productId, userId);
  }

  @UsePipes(ValidationPipe)
  @Patch()
  async updateProductInCart(
    @Body() updateCardDto: UpdateCardDto,
    @UserId() userId: number,
  ): Promise<ReturnCartDto> {
    const cart = await this.cartService.updateProductInCart(
      updateCardDto,
      userId,
    );

    if (!cart) {
      throw new NotFoundException(`Cart for userId: ${userId} not found`);
    }

    return new ReturnCartDto(cart);
  }
}
