import { Test, TestingModule } from '@nestjs/testing';
import { CorreiosController } from '@/correios/correios.controller';
import { CorreiosService } from '@/correios/correios.service';
import { NotFoundException } from '@nestjs/common';

describe('CorreiosController', () => {
  let controller: CorreiosController;
  let service: CorreiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorreiosController],
      providers: [
        {
          provide: CorreiosService,
          useValue: {
            findAddressByCep: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CorreiosController>(CorreiosController);
    service = module.get<CorreiosService>(CorreiosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return address when service succeeds', async () => {
    const cep = '12345678';

    const mockResponse = {
      cep: '12345-678',
      logradouro: 'Rua Teste',
      cityId: 1,
      stateId: 10,
    } as any;

    (service.findAddressByCep as jest.Mock).mockResolvedValue(mockResponse);

    const result = await controller.findAll(cep);

    expect(service.findAddressByCep).toHaveBeenCalledWith(cep);
    expect(result).toEqual(mockResponse);
  });

  it('should throw error when service throws NotFoundException', async () => {
    const cep = '00000000';

    (service.findAddressByCep as jest.Mock).mockRejectedValue(
      new NotFoundException('CEP not found'),
    );

    await expect(controller.findAll(cep)).rejects.toThrow(
      new NotFoundException('CEP not found'),
    );

    expect(service.findAddressByCep).toHaveBeenCalledWith(cep);
  });
});
