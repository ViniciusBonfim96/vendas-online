import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from '@/cart/cart.controller';
import { CartService } from '@/cart/cart.service';
import { insertCartMock } from '@/cart/__mocks__/insertCart.mock';
import { updateCartMock } from '@/cart/__mocks__/updateCart.mock';
import { cartEntityMock } from '@/cart/__mocks__/cart.mock';
import { ReturnCartDto } from '@/cart/dto/returnCart.dto';
import { returnDeleteMock } from '@/product/__mocks__/returnDelete.mock';
import { userEntityMock } from '@/user/__mocks__/user.mock';

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            insertProductInCart: jest.fn().mockResolvedValue(cartEntityMock),
            findCartByUserId: jest.fn().mockResolvedValue(cartEntityMock),
            clearCart: jest.fn().mockResolvedValue(undefined),
            deleteProductCart: jest.fn().mockResolvedValue(returnDeleteMock),
            updateProductInCart: jest.fn().mockResolvedValue(cartEntityMock),
          },
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // =========================
  // createCart
  // =========================
  it('should create cart and return DTO', async () => {
    const result = await controller.createCart(insertCartMock, 1);

    expect(cartService.insertProductInCart).toHaveBeenCalledWith(
      insertCartMock,
      1,
    );

    expect(result).toEqual(new ReturnCartDto(cartEntityMock));
  });

  it('should throw error when service fails on createCart', async () => {
    jest
      .spyOn(cartService, 'insertProductInCart')
      .mockRejectedValueOnce(new Error('error'));

    await expect(controller.createCart(insertCartMock, 1)).rejects.toThrow();
  });

  // =========================
  // findCartByUserId
  // =========================
  it('should return cart by userId', async () => {
    const result = await controller.findCartByUserId(1);

    expect(cartService.findCartByUserId).toHaveBeenCalledWith(1);

    expect(result).toEqual(new ReturnCartDto(cartEntityMock));
  });

  it('should throw error when cart not found', async () => {
    jest.spyOn(cartService, 'findCartByUserId').mockResolvedValueOnce(null);

    await expect(controller.findCartByUserId(1)).rejects.toThrow(
      'Cart for userId: 1 not found',
    );
  });

  // =========================
  // clearCart
  // =========================
  it('should clear cart', async () => {
    const result = await controller.clearCart(1);

    expect(cartService.clearCart).toHaveBeenCalledWith(1);

    expect(result).toEqual({ message: 'Cart cleared successfully' });
  });

  it('should throw error when service fails on clearCart', async () => {
    jest
      .spyOn(cartService, 'clearCart')
      .mockRejectedValueOnce(new Error('error'));

    await expect(controller.clearCart(1)).rejects.toThrow();
  });

  // =========================
  // deleteProductCart
  // =========================
  it('should delete product from cart', async () => {
    const result = await controller.deleteProductCart(1, 1);

    expect(cartService.deleteProductCart).toHaveBeenCalledWith(1, 1);

    expect(result).toEqual(returnDeleteMock);
  });

  it('should throw error when service fails on deleteProductCart', async () => {
    jest
      .spyOn(cartService, 'deleteProductCart')
      .mockRejectedValueOnce(new Error('error'));

    await expect(controller.deleteProductCart(1, 1)).rejects.toThrow();
  });

  it('should update product and return DTO', async () => {
    const result = await controller.updateProductInCart(
      updateCartMock,
      userEntityMock.id,
    );

    expect(cartService.updateProductInCart).toHaveBeenCalledWith(
      updateCartMock,
      userEntityMock.id,
    );

    expect(result).toEqual(new ReturnCartDto(cartEntityMock));
  });

  it('should throw error when cart not found on update', async () => {
    jest.spyOn(cartService, 'updateProductInCart').mockResolvedValueOnce(null);

    await expect(
      controller.updateProductInCart(updateCartMock, userEntityMock.id),
    ).rejects.toThrow(`Cart for userId: ${userEntityMock.id} not found`);
  });

  it('should throw error when service fails on update', async () => {
    jest
      .spyOn(cartService, 'updateProductInCart')
      .mockRejectedValueOnce(new Error('error'));

    await expect(
      controller.updateProductInCart(updateCartMock, userEntityMock.id),
    ).rejects.toThrow();
  });
});
