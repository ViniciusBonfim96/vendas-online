import { EmailField, PasswordField } from '@/common/validation';

export class LoginDto {
  @EmailField()
  email!: string;

  @PasswordField()
  password!: string;
}
