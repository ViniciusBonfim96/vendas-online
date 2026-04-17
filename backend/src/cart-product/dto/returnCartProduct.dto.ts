import { ReturnProductDto } from '@/product/dto/return-product.dto';
import { CartProductEntity } from '@/cart-product/entity/cart-product.entity';
import { ReturnCartDto } from '@/cart/dto/returnCart.dto';

export class ReturnCartProductDto {
  id!: number;
  cartId!: number;
  productId?: number;
  amount?: number;
  product?: ReturnProductDto;
  cart?: ReturnCartDto;

  constructor(cartProduct: CartProductEntity) {
    this.id = cartProduct.id;
    this.cartId = cartProduct.cartId;
    this.productId = cartProduct.productId;
    this.amount = cartProduct.amount;
    this.product = cartProduct.product
      ? new ReturnProductDto(cartProduct.product)
      : undefined;
    this.cart = cartProduct.cart
      ? new ReturnCartDto(cartProduct.cart)
      : undefined;
  }
}
