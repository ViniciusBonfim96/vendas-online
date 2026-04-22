import { AddressEntity } from '@/address/entity/address.entity';
import { ReturnCityDto } from '@/city/dto/returnCity.dto';

export class ReturnAddressDto {
  id: number;
  complement!: string;
  numberAddress!: number;
  cep!: string;
  city?: ReturnCityDto;

  constructor(adress: AddressEntity) {
    this.id = adress.id;
    this.complement = adress.complement;
    this.numberAddress = adress.numberAddress;
    this.cep = adress.cep;
    this.city = adress.city ? new ReturnCityDto(adress.city) : undefined;
  }
}
