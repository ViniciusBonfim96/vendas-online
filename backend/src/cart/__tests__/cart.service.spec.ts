import { Test, TestingModule } from '@nestjs/testing';
import { CartProductService } from '@/cart-product/cart-product.service';
import { Repository, DeleteResult } from 'typeorm';
import { CartProductEntity } from '@/cart-product/entity/cart-product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductService } from '@/product/product.service';
import { cartProductEntityMock } from '@/cart-product/__mocks__/cartProduct.mock';
import { insertCartMock } from '@/cart/__mocks__//insertCart.mock';
import { updateCartMock } from '@/cart/__mocks__/updateCart.mock';
import { productEntityMock } from '@/product/__mocks__/product.mock';
import { ReturnCartDto } from '@/cart/dto/returnCart.dto';
import { cartEntityMock } from '@/cart/__mocks__/cart.mock';

const returnCartMock = new ReturnCartDto(cartEntityMock);

describe('CartProductService', () => {
  let service: CartProductService;
  let cartProductRepository: Repository<CartProductEntity>;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartProductService,
        {
          provide: getRepositoryToken(CartProductEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(cartProductEntityMock),
            save: jest.fn().mockResolvedValue(cartProductEntityMock),
            delete: jest
              .fn()
              .mockResolvedValue({ affected: 1 } as DeleteResult),
            remove: jest.fn().mockResolvedValue(cartProductEntityMock),
          },
        },
        {
          provide: ProductService,
          useValue: {
            findProductById: jest.fn().mockResolvedValue(productEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<CartProductService>(CartProductService);
    cartProductRepository = module.get<Repository<CartProductEntity>>(
      getRepositoryToken(CartProductEntity),
    );
    productService = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return product in cart', async () => {
    const result = await service.verifyProductInCart(
      productEntityMock.id,
      cartEntityMock.id,
    );

    expect(cartProductRepository.findOne).toHaveBeenCalledWith({
      where: { productId: productEntityMock.id, cartId: cartEntityMock.id },
    });

    expect(result).toEqual(cartProductEntityMock);
  });

  it('should return null when product not in cart', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValueOnce(null);

    const result = await service.verifyProductInCart(
      productEntityMock.id,
      cartEntityMock.id,
    );

    expect(result).toBeNull();
  });

  it('should create product when not exists in cart', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValueOnce(null);

    const result = await service.insertProductInCart(
      insertCartMock,
      cartEntityMock,
    );

    expect(productService.findProductById).toHaveBeenCalledWith(
      insertCartMock.productId,
    );

    expect(cartProductRepository.save).toHaveBeenCalledWith({
      amount: insertCartMock.amount,
      productId: insertCartMock.productId,
      cartId: cartEntityMock.id,
    });

    expect(result).toEqual(cartProductEntityMock);
  });

  it('should update amount when product already exists', async () => {
    const result = await service.insertProductInCart(
      insertCartMock,
      cartEntityMock,
    );

    expect(cartProductRepository.save).toHaveBeenCalledWith({
      ...cartProductEntityMock,
      amount: cartProductEntityMock.amount + insertCartMock.amount,
    });

    expect(result).toEqual(cartProductEntityMock);
  });

  it('should throw error when product not found on insert', async () => {
    jest.spyOn(productService, 'findProductById').mockResolvedValueOnce(null);

    await expect(
      service.insertProductInCart(insertCartMock, cartEntityMock),
    ).rejects.toThrow(`ProductId: ${insertCartMock.productId} not found`);

    expect(cartProductRepository.save).not.toHaveBeenCalled();
  });

  it('should delete product from cart', async () => {
    const result = await service.deleteProductCart(
      productEntityMock.id,
      cartEntityMock.id,
    );

    expect(cartProductRepository.delete).toHaveBeenCalledWith({
      productId: productEntityMock.id,
      cartId: cartEntityMock.id,
    });

    expect(result).toEqual({ affected: 1 });
  });

  it('should throw error when delete fails', async () => {
    jest
      .spyOn(cartProductRepository, 'delete')
      .mockRejectedValueOnce(new Error('DB error'));

    await expect(service.deleteProductCart(1, 1)).rejects.toThrow('DB error');
  });

  it('should update product amount', async () => {
    await service.updateProductInCart(updateCartMock, returnCartMock);

    expect(cartProductRepository.save).toHaveBeenCalledWith({
      ...cartProductEntityMock,
      amount: updateCartMock.amount,
    });
  });

  it('should create product when not exists on update', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValueOnce(null);

    await service.updateProductInCart(updateCartMock, returnCartMock);

    expect(cartProductRepository.save).toHaveBeenCalled();
  });

  it('should remove product when amount is zero', async () => {
    const dto = { ...updateCartMock, amount: 0 };

    await service.updateProductInCart(dto, returnCartMock);

    expect(cartProductRepository.remove).toHaveBeenCalledWith(
      cartProductEntityMock,
    );
  });

  it('should throw error when amount is negative', async () => {
    const dto = { ...updateCartMock, amount: -1 };

    await expect(
      service.updateProductInCart(dto, returnCartMock),
    ).rejects.toThrow('Quantity cannot be negative');

    expect(cartProductRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when product not found on update', async () => {
    jest.spyOn(productService, 'findProductById').mockResolvedValueOnce(null);

    await expect(
      service.updateProductInCart(updateCartMock, returnCartMock),
    ).rejects.toThrow(`ProductId: ${updateCartMock.productId} not found`);
  });

  it('should throw error when repository fails on update', async () => {
    jest
      .spyOn(cartProductRepository, 'save')
      .mockRejectedValueOnce(new Error('DB error'));

    await expect(
      service.updateProductInCart(updateCartMock, returnCartMock),
    ).rejects.toThrow('DB error');
  });
});
