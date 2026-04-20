import { returnUserMock } from '@/user/__mocks__/returnUser.mock';
import { ReturnLoginDto } from '../dto/returnLogin.dto';

export const returnLoginMock: ReturnLoginDto = {
  user: returnUserMock,
  accessToken: '',
};
