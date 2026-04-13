import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { hash } from 'bcrypt';
import { ReturnUserDto } from './dtos/returnUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, cpf, password } = createUserDto;

    const users = await this.userRepository.find({
      where: [{ email }, { cpf }],
    });

    if (users) {
      throw new BadRequestException('Email or CPF already exists');
    }

    const saltOrRounds = 10;
    const passwordHash = await hash(password, saltOrRounds);

    const createdUser = this.userRepository.create({
      ...createUserDto,
      type_user: 1,
      password: passwordHash,
    });

    return await this.userRepository.save(createdUser);
  }

  async getAllUser(): Promise<ReturnUserDto[]> {
    const users = await this.userRepository.find();

    const returnUserDto = users.map((users) => new ReturnUserDto(users));

    return returnUserDto;
  }

  async findUserById(userId: number): Promise<ReturnUserDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`UserId: ${userId} not found`);
    }

    return new ReturnUserDto(user);
  }
}
