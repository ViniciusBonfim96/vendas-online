import { Test, TestingModule } from '@nestjs/testing';
import { CorreiosService } from '@/correios/correios.service';
import { HttpService } from '@nestjs/axios';
import { CityService } from '@/city/city.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiResponseMock } from '../__mocks__/apiResponse.mock';

describe('CorreiosService', () => {
  let service: CorreiosService;
  let httpService: HttpService;
  let cityService: CityService;

  beforeEach(async () => {
    process.env.URL_CEP_CORREIOS = 'https://viacep.com.br/ws/{CEP}/json/';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CorreiosService,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn(),
            },
          },
        },
        {
          provide: CityService,
          useValue: {
            findCityByName: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CorreiosService>(CorreiosService);
    httpService = module.get<HttpService>(HttpService);
    cityService = module.get<CityService>(CityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return address when CEP is valid and city exists', async () => {
    const cep = '12345678';

    const mockCity = {
      id: 1,
      name: 'Belo Horizonte',
      state: {
        id: 10,
        uf: 'MG',
      },
    };

    (httpService.axiosRef.get as jest.Mock).mockResolvedValue({
      data: ApiResponseMock,
    });

    (cityService.findCityByName as jest.Mock).mockResolvedValue(mockCity);

    const result = await service.findAddressByCep(cep);

    expect(httpService.axiosRef.get).toHaveBeenCalledWith(
      expect.stringContaining(cep),
    );

    expect(cityService.findCityByName).toHaveBeenCalledWith(
      ApiResponseMock.localidade,
      ApiResponseMock.uf,
    );

    expect(result).toBeDefined();
    expect(result.cityId).toBe(1);
    expect(result.stateId).toBe(10);
  });

  it('should throw NotFoundException when CEP not found', async () => {
    (httpService.axiosRef.get as jest.Mock).mockResolvedValue({
      data: { erro: true },
    });

    await expect(service.findAddressByCep('00000000')).rejects.toThrow(
      new NotFoundException('CEP not found'),
    );
  });

  it('should throw NotFoundException when city not found', async () => {
    (httpService.axiosRef.get as jest.Mock).mockResolvedValue({
      data: ApiResponseMock,
    });

    (cityService.findCityByName as jest.Mock).mockResolvedValue(null);

    await expect(service.findAddressByCep('12345678')).rejects.toThrow(
      new NotFoundException(
        `City not found: ${ApiResponseMock.localidade} - ${ApiResponseMock.uf}`,
      ),
    );
  });

  it('should throw BadRequestException when http request fails', async () => {
    (httpService.axiosRef.get as jest.Mock).mockRejectedValue(
      new Error('Network error'),
    );

    await expect(service.findAddressByCep('12345678')).rejects.toThrow(
      new BadRequestException('Error in connection request Network error'),
    );
  });
});
