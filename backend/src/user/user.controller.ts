import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from '@/user/dtos/createUser.dto';
import { UserService } from '@/user/user.service';
import { ReturnUserDto } from '@/user/dtos/returnUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getAllUsers(): Promise<ReturnUserDto[]> {
    const users = await this.userService.getAllUser();

    const userDto = users.map((users) => new ReturnUserDto(users));

    return userDto;
  }
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
