import { BaseString } from '@/common/validation';
import { IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsNumber()
  categoryId?: number;

  @BaseString({ trim: true })
  name?: string;

  @IsNumber()
  price?: number;

  @IsString()
  image?: string;
}
