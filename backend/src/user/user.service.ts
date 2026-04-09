import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { hash } from 'bcrypt';
import { error } from 'console';
import { handleDatabaseError } from '@/common/validation/util/database.error';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { password } = createUserDto;

    const saltOrRounds = 10;
    const passwordHash = await hash(password, saltOrRounds);

    const createdUser = this.userRepository.create({
      ...createUserDto,
      type_user: 1,
      password: passwordHash,
    });

    try {
      return await this.userRepository.save(createdUser);
    } catch (error: unknown) {
      handleDatabaseError(error, 'Erro ao criar usuário');
    }
  }

  async getAllUser(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
}
