import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from '@/user/dtos/createUser.dto';
import { UserService } from '@/user/user.service';
import { ReturnUserDto } from '@/user/dtos/returnUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getAllUsers(): Promise<ReturnUserDto[]> {
    const users = await this.userService.getAllUser();

    return users.map((user) => new ReturnUserDto(user));
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('/:userId')
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDto> {
    const user = await this.userService.getUserByIdUsingRelations(userId);
    return new ReturnUserDto(user);
  }
}
