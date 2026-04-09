import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from '@/user/dtos/createUser.dto';
import { UserService } from '@/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getAllUsers() {
    return this.userService.getAllUser();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
