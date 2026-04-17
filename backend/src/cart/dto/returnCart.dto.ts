import { ReturnCartProductDto } from '@/cart-product/dto/returnCartProduct.dto';
import { CartEntity } from '../entity/cart.entity';

export class ReturnCartDto {
  id: number;
  cartProduct?: ReturnCartProductDto[];

  constructor(cart: CartEntity) {
    this.id = cart.id;
    this.cartProduct = cart.cartProduct
      ? cart.cartProduct.map(
          (cartProduct) => new ReturnCartProductDto(cartProduct),
        )
      : undefined;
  }
}
