import { IsNumber } from 'class-validator';

export class UpdateCardDto {
  @IsNumber()
  productId!: number;

  @IsNumber()
  amount!: number;
}
