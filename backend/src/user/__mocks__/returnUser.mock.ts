import { ReturnUserDto } from '@/user/dtos/returnUser.dto';
import { userEntityMock } from '@/user/__mocks__/user.mock';

export const returnUserMock: ReturnUserDto = {
  id: userEntityMock.id,
  name: userEntityMock.name,
  email: userEntityMock.email,
  phone: userEntityMock.phone,
  cpf: userEntityMock.cpf,
};
