import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '@/user/dtos/createUser.dto';
import { UserService } from '@/user/user.service';
import { ReturnUserDto } from '@/user/dtos/returnUser.dto';
import { Roles } from '@/decorators/roles.decorator';
import { UserType } from '@/user/enum/user-type.enum';
import { UserId } from '@/decorators/user-id-decorator';
import { UserEntity } from '@/user/entity/user.entity';
import { UpdatePasswordUserDto } from './dtos/updatePassword.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserType.Admin)
  @Get()
  async getAllUsers(): Promise<ReturnUserDto[]> {
    const users = await this.userService.getAllUser();

    return users.map((user) => new ReturnUserDto(user));
  }

  @Roles(UserType.Admin)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Roles(UserType.Admin)
  @Get('/all')
  async getUserById(): Promise<UserEntity[]> {
    return this.userService.getAllUser();
  }

  @Roles(UserType.Admin, UserType.User)
  @Patch()
  @UsePipes(ValidationPipe)
  async updatePasswordUser(
    @Body() updatePasswordUserDto: UpdatePasswordUserDto,
    @UserId() userId: number,
  ): Promise<UserEntity> {
    return this.userService.updatePasswordUser(userId, updatePasswordUserDto);
  }

  @Roles(UserType.Admin, UserType.User)
  @Get()
  async getInfoUser(@UserId() userId: number): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.userService.getUserByIdUsingRelations(userId),
    );
  }
}
