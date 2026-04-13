import { ReturnUserDto } from '@/user/dtos/returnUser.dto';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from '@/auth/dto/login.dto';
import { AuthService } from '@/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async signIn(@Body() loginDto: LoginDto): Promise<ReturnUserDto> {
    const user = await this.authService.singIn(loginDto);

    return new ReturnUserDto(user);
  }
}
