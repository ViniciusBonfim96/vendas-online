import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '@/product/product.controller';
import { ProductService } from '@/product/product.service';
import { productEntityMock } from '@/product/__mocks__/product.mock';
import { createProductMock } from '@/product/__mocks__/createProduct.mock';
import { updateProductMock } from '@/product/__mocks__/updateProduct.mock';
import { ReturnProductDto } from '@/product/dto/return-product.dto';
import { returnDeleteMock } from '@/product/__mocks__/returnDelete.mock';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAllProducts: jest.fn().mockResolvedValue([productEntityMock]),
            createProduct: jest.fn().mockResolvedValue(productEntityMock),
            deleteProduct: jest.fn().mockResolvedValue(returnDeleteMock),
            updateProduct: jest.fn().mockResolvedValue(productEntityMock),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all products', async () => {
    const result = await controller.findAllProducts();

    expect(productService.findAllProducts).toHaveBeenCalled();

    expect(result).toEqual([new ReturnProductDto(productEntityMock)]);
  });

  it('should throw error when service fails on findAllProducts', async () => {
    jest
      .spyOn(productService, 'findAllProducts')
      .mockRejectedValueOnce(new Error('DB error'));

    await expect(controller.findAllProducts()).rejects.toThrow('DB error');
  });

  it('should create product', async () => {
    const result = await controller.createProduct(createProductMock);

    expect(productService.createProduct).toHaveBeenCalledWith(
      createProductMock,
    );

    expect(result).toEqual(productEntityMock);
  });

  it('should throw error when service fails on createProduct', async () => {
    jest
      .spyOn(productService, 'createProduct')
      .mockRejectedValueOnce(new Error('error'));

    await expect(controller.createProduct(createProductMock)).rejects.toThrow();
  });

  it('should delete product', async () => {
    const result = await controller.deleteProduct(productEntityMock.id);

    expect(productService.deleteProduct).toHaveBeenCalledWith(
      productEntityMock.id,
    );

    expect(result).toEqual(returnDeleteMock);
  });

  it('should throw error when service fails on deleteProduct', async () => {
    jest
      .spyOn(productService, 'deleteProduct')
      .mockRejectedValueOnce(new Error('error'));

    await expect(controller.deleteProduct(1)).rejects.toThrow();
  });

  it('should update product', async () => {
    const result = await controller.updateProduct(
      updateProductMock,
      productEntityMock.id,
    );

    expect(productService.updateProduct).toHaveBeenCalledWith(
      updateProductMock,
      999999,
    );

    expect(result).toEqual(productEntityMock);
  });

  it('should throw error when service fails on updateProduct', async () => {
    jest
      .spyOn(productService, 'updateProduct')
      .mockRejectedValueOnce(new Error('error'));

    await expect(
      controller.updateProduct(updateProductMock, productEntityMock.id),
    ).rejects.toThrow();
  });
});
