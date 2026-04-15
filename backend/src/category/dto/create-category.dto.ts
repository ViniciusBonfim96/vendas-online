import { NameField } from '@/common/validation';

export class CreateCategoryDto {
  @NameField()
  name!: string;
}
