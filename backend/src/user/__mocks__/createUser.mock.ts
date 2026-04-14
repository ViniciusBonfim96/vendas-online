import { CreateUserDto } from '@/user/dtos/createUser.dto';
import { userEntityMock } from './user.mock';

export const createUserMock: CreateUserDto = {
  name: userEntityMock.name,
  email: userEntityMock.email,
  password: userEntityMock.password,
  cpf: userEntityMock.cpf,
  phone: userEntityMock.phone,
};
