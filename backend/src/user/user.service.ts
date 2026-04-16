import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '@/user/dtos/createUser.dto';
import { compare, hash } from 'bcrypt';
import { UserType } from './enum/user-type.enum';
import { UpdatePasswordUserDto } from '@/user/dtos/updatePassword.dto';

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

    if (users.length > 0) {
      throw new BadRequestException('Email or CPF already exists');
    }

    const saltOrRounds = 10;
    const passwordHash = await hash(password, saltOrRounds);

    const createdUser = this.userRepository.create({
      ...createUserDto,
      type_user: UserType.User,
      password: passwordHash,
    });

    return await this.userRepository.save(createdUser);
  }

  async getAllUser(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findUserById(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`UserId: ${userId} not found`);
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException(`Email: ${email} not found`);
    }

    return user;
  }

  async getUserByIdUsingRelations(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: { addresses: { city: { state: true } } },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updatePasswordUser(
    UserId: number,
    updatePasswordUserDto: UpdatePasswordUserDto,
  ): Promise<UserEntity> {
    const { lastPassword, newPassword } = updatePasswordUserDto;

    const user = await this.findUserById(UserId);

    const validatePassword = await compare(lastPassword, user?.password || '');

    if (!validatePassword) {
      throw new NotFoundException('The last password invalid');
    }

    const saltOrRounds = 10;
    const passwordHash = await hash(newPassword, saltOrRounds);

    return this.userRepository.save({
      ...user,
      password: passwordHash,
    });
  }
}
