import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from '@/cache/cache.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

describe('CacheService', () => {
  let service: CacheService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cacheManager).toBeDefined();
  });

  it('should return data from cache when exists (cache hit)', async () => {
    (cacheManager.get as jest.Mock).mockResolvedValueOnce('cached-data');

    const functionRequest = jest.fn();

    const result = await service.getCache('test-key', functionRequest);

    expect(cacheManager.get).toHaveBeenCalledWith('test-key');
    expect(functionRequest).not.toHaveBeenCalled();
    expect(cacheManager.set).not.toHaveBeenCalled();
    expect(result).toBe('cached-data');
  });

  it('should call function and store result when cache miss', async () => {
    (cacheManager.get as jest.Mock).mockResolvedValueOnce(null);

    const functionRequest = jest.fn().mockResolvedValue('fresh-data');

    const result = await service.getCache('test-key', functionRequest);

    expect(cacheManager.get).toHaveBeenCalledWith('test-key');
    expect(functionRequest).toHaveBeenCalled();
    expect(cacheManager.set).toHaveBeenCalledWith('test-key', 'fresh-data');
    expect(result).toBe('fresh-data');
  });

  it('should throw error if functionRequest fails', async () => {
    (cacheManager.get as jest.Mock).mockResolvedValueOnce(null);

    const functionRequest = jest.fn().mockRejectedValue(new Error('fail'));

    await expect(
      service.getCache('test-key', functionRequest),
    ).rejects.toThrow();
  });

  it('should throw error if cache set fails', async () => {
    (cacheManager.get as jest.Mock).mockResolvedValueOnce(null);

    const functionRequest = jest.fn().mockResolvedValue('data');

    (cacheManager.set as jest.Mock).mockRejectedValueOnce(
      new Error('set fail'),
    );

    await expect(
      service.getCache('test-key', functionRequest),
    ).rejects.toThrow();
  });
});
