import { AddressEntity } from '@/address/entity/address.entity';

export class ReturnAddressDto {
  complement!: string;
  numberAddress!: number;
  cep!: string;
  cityId?: any;

  constructor(adress: AddressEntity) {
    this.complement = adress.complement;
    this.numberAddress = adress.numberAddress;
    this.cep = adress.cep;
  }
}
