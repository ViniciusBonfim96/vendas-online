import { userEntityMock } from '@/user/__mocks__/user.mock';
import { LoginDto } from '@/auth/dto/login.dto';

export const loginMock: LoginDto = {
  email: userEntityMock.email,
  password: userEntityMock.password,
};
