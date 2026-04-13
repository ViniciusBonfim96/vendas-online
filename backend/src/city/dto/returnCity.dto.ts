import { ReturnStateDto } from '@/state/dto/returnState.dto';
import { CityEntity } from '../entity/city.entity';

export class ReturnCityDto {
  name: string;
  state?: ReturnStateDto;

  constructor(city: CityEntity) {
    this.name = city.name;
    this.state = city.state ? new ReturnStateDto(city.state) : undefined;
  }
}
