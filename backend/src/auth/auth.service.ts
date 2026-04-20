import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from '@/auth/dto/login.dto';
import { UserEntity } from '@/user/entity/user.entity';
import { UserService } from '@/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ReturnLoginDto } from './dto/returnLogin.dto';
import { LoginPayloadDto } from './dto/loginPayload.dto';
import { ReturnUserDto } from '@/user/dtos/returnUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginDto: LoginDto): Promise<ReturnLoginDto> {
    const { email, password } = loginDto;

    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(email)
      .catch(() => undefined);

    const isMatch = await compare(password, user?.password || '');

    if (!user || !isMatch) {
      throw new NotFoundException(`Email or password invalid.`);
    }

    return {
      user: new ReturnUserDto(user),
      accessToken: this.jwtService.sign({ ...new LoginPayloadDto(user) }),
    };
  }
}
