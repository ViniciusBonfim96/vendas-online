import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '@/payment/payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentEntity } from '@/payment/entity/payment.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { PaymentType } from '@/payment-status/enum/paymentType.enum';
import { cartEntityMock } from '@/cart/__mocks__/cart.mock';
import { paymentEntityMock } from '@/payment/__mocks__/payment.mock';
import { PaymentCreditCardEntity } from '@/payment/entity/paymentCreditCard.entity';
import { PaymentPixEntity } from '@/payment/entity/paymentPix.entity';
import { paymentCreditCardEntityMock } from '@/payment/__mocks__/paymentCreditCard.mock';
import { paymentPixEntityMock } from '@/payment/__mocks__/paymentPix.mock';
import { productEntityMock } from '@/product/__mocks__/product.mock';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: Repository<PaymentEntity>;

  const productsMock = [
    {
      id: productEntityMock.id,
      price: productEntityMock.price,
    },
  ] as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(PaymentEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(paymentEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get(getRepositoryToken(PaymentEntity));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(paymentRepository).toBeDefined();
  });

  describe('createPayment', () => {
    it('should create credit card payment', async () => {
      const dto = {
        amountPayments: 2,
      } as any;

      (paymentRepository.save as jest.Mock).mockResolvedValue(
        paymentCreditCardEntityMock,
      );

      const result = await service.createPayment(
        dto,
        productsMock,
        cartEntityMock,
      );

      expect(paymentRepository.save).toHaveBeenCalledTimes(1);

      const savedArg = (paymentRepository.save as jest.Mock).mock.calls[0][0];

      expect(savedArg).toBeInstanceOf(PaymentCreditCardEntity);
      expect(savedArg.price).toBe(200);
      expect(savedArg.finalPrice).toBe(200);
      expect(savedArg.statusId).toBe(PaymentType.Done);

      expect(result).toEqual(paymentCreditCardEntityMock);
    });

    it('should create pix payment', async () => {
      const dto = {
        codePix: '123',
        datePayment: new Date(),
      } as any;

      (paymentRepository.save as jest.Mock).mockResolvedValue(
        paymentPixEntityMock,
      );

      const result = await service.createPayment(
        dto,
        productsMock,
        cartEntityMock,
      );

      expect(paymentRepository.save).toHaveBeenCalledTimes(1);

      const savedArg = (paymentRepository.save as jest.Mock).mock.calls[0][0];

      expect(savedArg).toBeInstanceOf(PaymentPixEntity);
      expect(savedArg.price).toBe(200);
      expect(savedArg.finalPrice).toBe(200);

      expect(result).toEqual(paymentPixEntityMock);
    });

    it('should throw error when payment data is invalid', async () => {
      const dto = {} as any;

      await expect(
        service.createPayment(dto, productsMock, cartEntityMock),
      ).rejects.toThrow(
        new BadRequestException(
          'Amount Payments or code pix or date payment not found',
        ),
      );

      expect(paymentRepository.save).not.toHaveBeenCalled();
    });
  });
});
