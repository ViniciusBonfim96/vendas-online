import { UserEntity } from '@/user/entity/user.entity';
import { UserType } from '@/user/enum/user-type.enum';

export const userEntityMock: UserEntity = {
  id: 9999999,
  name: 'nameMock',
  email: 'emailmock@email.com',
  password: 'MockPassword',
  cpf: '12345678910',
  phone: '11123456789',
  type_user: UserType.User,
  created_at: new Date(),
  updated_at: new Date(),
};
