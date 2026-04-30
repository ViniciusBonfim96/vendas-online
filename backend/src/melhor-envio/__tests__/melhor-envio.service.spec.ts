import { Test, TestingModule } from '@nestjs/testing';
import { MelhorEnvioService } from '@/melhor-envio/melhor-envio.service';
import axios from 'axios';
import { HttpException } from '@nestjs/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MelhorEnvioService', () => {
  let service: MelhorEnvioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MelhorEnvioService],
    }).compile();

    service = module.get<MelhorEnvioService>(MelhorEnvioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return shipping data when request succeeds', async () => {
    const mockResponse = {
      data: [{ name: 'PAC', price: '20.00', delivery_time: 5 }],
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse as any);

    const result = await service.calculateShipping('20040002');

    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result).toEqual(mockResponse.data);
  });

  it('should throw HttpException when request fails', async () => {
    const mockError = {
      response: {
        data: { message: 'CEP inválido' },
        status: 400,
      },
    };

    mockedAxios.post.mockRejectedValueOnce(mockError as any);

    await expect(service.calculateShipping('00000000')).rejects.toThrow(
      HttpException,
    );
  });

  it('should call axios with correct payload', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: [] } as any);

    await service.calculateShipping('20040002');

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/shipment/calculate'),
      expect.objectContaining({
        from: { postal_code: '01310100' },
        to: { postal_code: '20040002' },
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining('Bearer'),
        }),
      }),
    );
  });
});
