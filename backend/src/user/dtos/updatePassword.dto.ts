import { PasswordField } from '@/common/validation';

export class UpdatePasswordUserDto {
  @PasswordField()
  newPassword!: string;

  @PasswordField()
  lastPassword!: string;
}
