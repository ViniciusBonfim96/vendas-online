import { BaseString } from '@/common/validation';
import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  categoryId!: number;

  @BaseString({ trim: true })
  name!: string;

  @IsNumber()
  price!: number;

  @IsString()
  image!: string;
}
