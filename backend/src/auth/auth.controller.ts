import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from '@/auth/dto/login.dto';
import { AuthService } from '@/auth/auth.service';
import { ReturnLoginDto } from '@/auth/dto/returnLogin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async signIn(@Body() loginDto: LoginDto): Promise<ReturnLoginDto> {
    return this.authService.singIn(loginDto);
  }
}
