import { Body, Controller, Get } from '@nestjs/common';
import { CityService } from '@/city/city.service';
import { CityEntity } from '@/city/entity/city.entity';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get('/:state_id')
  async getAllCityByStateId(): Promise<CityEntity[]> {
    return this.cityService.getAllCityByStateId(1);
  }
}
