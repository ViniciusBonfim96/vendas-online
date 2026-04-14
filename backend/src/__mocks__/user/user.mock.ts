import { UserEntity } from '@/user/entity/user.entity';
import { UserType } from '@/user/enum/user-type.enum';

export const userEntityMock: UserEntity = {
  cpf: '123543543',
  created_at: new Date(),
  email: 'emailmock@emali.com',
  id: 43242,
  name: 'nameMock',
  password: 'largePassword',
  phone: '321532523532',
  type_user: UserType.User,
  updated_at: new Date(),
};
