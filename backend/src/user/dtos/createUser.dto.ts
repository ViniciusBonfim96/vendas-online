import {
  CPFField,
  EmailField,
  NameField,
  PasswordField,
  PhoneField,
} from '@/common/validation';

export class CreateUserDto {
  @NameField()
  name!: string;

  @EmailField()
  email!: string;

  @PhoneField()
  phone?: string;

  @CPFField()
  cpf!: string;

  @PasswordField()
  password!: string;
}
