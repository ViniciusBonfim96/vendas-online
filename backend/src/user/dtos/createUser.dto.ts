import {
  CPFField,
  EmailField,
  NameField,
  PasswordField,
  PhoneField,
} from '@/common/validation';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @NameField()
  name!: string;

  @EmailField()
  email!: string;

  @PhoneField()
  phone?: string;

  @IsString()
  @CPFField()
  cpf!: string;

  @PasswordField()
  password!: string;
}
