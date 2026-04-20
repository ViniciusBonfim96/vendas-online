import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartService } from '@/cart/cart.service';
import { Repository } from 'typeorm';
import { CartEntity } from '@/cart/entity/cart.entity';
import { CartProductService } from '@/cart-product/cart-product.service';
import { ProductService } from '@/product/product.service';

describe('CartService', () => {
  let service: CartService;
  let cartProductService: CartProductService;
  let productService: ProductService;
  let cartRepository: Repository<CartEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(CartEntity),
          useValue: {},
        },
        {
          provide: CartProductService,
          useValue: {},
        },
        {
          provide: ProductService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<CartEntity>>(
      getRepositoryToken(CartEntity),
    );
    cartProductService = module.get<CartProductService>(CartProductService);
    productService = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartRepository).toBeDefined();
  });
});
