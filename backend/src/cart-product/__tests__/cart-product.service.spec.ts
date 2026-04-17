import { Repository } from 'typeorm';
import { CartProductService } from '@/cart-product/cart-product.service';
import { CartProductEntity } from '@/cart-product/entity/cart-product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '@/product/product.service';

describe('CartProductService', () => {
  let service: CartProductService;
  let serviceProduct: ProductService;
  let cartRepository: Repository<CartProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartProductService,
        {
          provide: getRepositoryToken(CartProductEntity),
          useValue: {},
        },
        {
          provide: ProductService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CartProductService>(CartProductService);
    cartRepository = module.get<Repository<CartProductEntity>>(
      getRepositoryToken(CartProductEntity),
    );
    serviceProduct = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartRepository).toBeDefined();
  });
});
