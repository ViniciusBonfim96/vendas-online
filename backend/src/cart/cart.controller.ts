import { Roles } from '@/decorators/roles.decorator';
import { UserType } from '@/user/enum/user-type.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CartService } from '@/cart/cart.service';
import { UserId } from '@/decorators/user-id-decorator';
import { InsertCardDto } from '@/cart/dto/insertCart.dto';
import { ReturnCartDto } from './dto/returnCart.dto';

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
}
