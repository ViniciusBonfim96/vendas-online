import { Test, TestingModule } from '@nestjs/testing';
import { CityService } from '@/city/city.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from '@/city/entity/city.entity';
import { CacheService } from '@/cache/cache.service';
import { cityEntityMock } from '@/city/__mocks__/city.mock';
import { stateEntityMock } from '@/state/__mocks__/state.mock';

describe('CityService', () => {
  let service: CityService;
  let cityRepository: Repository<CityEntity>;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: getRepositoryToken(CityEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([cityEntityMock]),
            findOne: jest.fn().mockResolvedValue(cityEntityMock),
          },
        },
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    cityRepository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );
    cacheService = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return cities using cache (cache hit)', async () => {
    jest
      .spyOn(cacheService, 'getCache')
      .mockResolvedValueOnce([cityEntityMock]);

    const result = await service.getAllCitiesByStateId(stateEntityMock.id);

    expect(cacheService.getCache).toHaveBeenCalledWith(
      'state_9999999',
      expect.any(Function),
    );

    expect(result).toEqual([cityEntityMock]);
  });

  it('should call repository when cache miss', async () => {
    jest
      .spyOn(cacheService, 'getCache')
      .mockImplementationOnce(async (_, fn) => fn());

    const result = await service.getAllCitiesByStateId(stateEntityMock.id);

    expect(cityRepository.find).toHaveBeenCalledWith({
      where: { state_id: stateEntityMock.id },
    });

    expect(result).toEqual([cityEntityMock]);
  });

  it('should throw error when cache fails', async () => {
    jest
      .spyOn(cacheService, 'getCache')
      .mockRejectedValueOnce(new Error('Cache error'));

    await expect(service.getAllCitiesByStateId(1)).rejects.toThrow(
      'Cache error',
    );
  });

  it('should return city by id', async () => {
    const result = await service.findCityById(cityEntityMock.id);

    expect(cityRepository.findOne).toHaveBeenCalledWith({
      where: { id: cityEntityMock.id },
    });

    expect(result).toEqual(cityEntityMock);
  });

  it('should throw error when city not found', async () => {
    jest.spyOn(cityRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(service.findCityById(cityEntityMock.id)).rejects.toThrow(
      `CityId: ${cityEntityMock.id} not found`,
    );
  });

  it('should throw error when repository fails', async () => {
    jest
      .spyOn(cityRepository, 'findOne')
      .mockRejectedValueOnce(new Error('DB error'));

    await expect(service.findCityById(1)).rejects.toThrow('DB error');
  });
});
