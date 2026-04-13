import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from '@/auth/dto/login.dto';
import { UserEntity } from '@/user/entity/user.entity';
import { UserService } from '@/user/user.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async singIn(loginDto: LoginDto): Promise<UserEntity> {
    const { email, password } = loginDto;

    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(email)
      .catch(() => undefined);

    const isMatch = await compare(password, user?.password || '');

    if (!user || !isMatch) {
      throw new NotFoundException(`Email or password invalid.`);
    }

    return user;
  }
}
