import { BaseString } from '@/common/validation/base/string-base.decorator';
import { OnlyNumbers } from '@/common/validation/transformers/transformers';
import { IsInt } from 'class-validator';
export class CreateAddressDto {
  @BaseString({ min: 5, max: 255, trim: true })
  complement!: string;

  @IsInt()
  numberAddress!: number;

  @BaseString({ min: 3, max: 255, trim: true })
  @OnlyNumbers()
  cep!: string;

  @IsInt()
  cityId!: number;
}
