import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityEntity } from '@/city/entity/city.entity';
import { Repository } from 'typeorm';
import { CacheService } from '@/cache/cache.service';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    private readonly cacheService: CacheService,
  ) {}

  async getAllCityByStateId(state_id: number): Promise<CityEntity[]> {
    return this.cacheService.getCache<CityEntity[]>(`state_${state_id}`, () =>
      this.cityRepository.find({ where: { state_id } }),
    );
  }
}
