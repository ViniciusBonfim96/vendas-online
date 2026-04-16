import { UpdatePasswordUserDto } from '../dtos/updatePassword.dto';
import { userEntityMock } from './user.mock';

export const updatePasswordMock: UpdatePasswordUserDto = {
  lastPassword: userEntityMock.password,
  newPassword: userEntityMock.password,
};
