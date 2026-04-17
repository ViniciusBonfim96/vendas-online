import { IsNumber } from 'class-validator';

export class InsertCardDto {
  @IsNumber()
  productId!: number;

  @IsNumber()
  amount!: number;
}
