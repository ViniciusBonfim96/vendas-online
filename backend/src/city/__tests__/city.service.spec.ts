import { Repository } from 'typeorm';
import { CityService } from '@/city/city.service';
import { CityEntity } from '@/city/entity/city.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { cityEntityMock } from '@/city/__mock__/city.mock';
import { CacheService } from '@/cache/cache.service';

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
            findOne: jest.fn().mockResolvedValue(cityEntityMock),
            find: jest.fn().mockResolvedValue([cityEntityMock]),
          },
        },
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn().mockImplementation(async (key, callback) => {
              return callback();
            }),
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
    expect(cityRepository).toBeDefined();
    expect(cacheService).toBeDefined();
  });

  it('should return city by id', async () => {
    const city = await service.findCityById(cityEntityMock.id);

    expect(cityRepository.findOne).toHaveBeenCalledWith({
      where: { id: cityEntityMock.id },
    });

    expect(city).toEqual(cityEntityMock);
  });

  it('should throw error when city not found', async () => {
    jest.spyOn(cityRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(service.findCityById(cityEntityMock.id)).rejects.toThrow();
  });

  it('should return cities by state id using cache', async () => {
    const city = await service.getAllCitiesByStateId(cityEntityMock.id);

    expect(cacheService.getCache).toHaveBeenCalledWith(
      `state_${cityEntityMock.id}`,
      expect.any(Function),
    );

    expect(cityRepository.find).toHaveBeenCalledWith({
      where: { state_id: cityEntityMock.id },
    });

    expect(city).toEqual([cityEntityMock]);
  });

  it('should return empty list when no cities exist', async () => {
    jest.spyOn(cityRepository, 'find').mockResolvedValueOnce([]);

    const city = await service.getAllCitiesByStateId(cityEntityMock.id);

    expect(city).toEqual([]);
  });

  it('should return data from cache without calling repository', async () => {
    jest
      .spyOn(cacheService, 'getCache')
      .mockResolvedValueOnce([cityEntityMock]);

    const city = await service.getAllCitiesByStateId(cityEntityMock.id);

    expect(cityRepository.find).not.toHaveBeenCalled();
    expect(city).toEqual([cityEntityMock]);
  });
});
