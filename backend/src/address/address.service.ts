import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from '@/address/entity/address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from '@/address/dto/createAddress.dto';
import { UserService } from '@/user/user.service';
import { CityService } from '@/city/city.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly userService: UserService,
    private readonly cityService: CityService,
  ) {}

  async createAddress(
    createAddress: CreateAddressDto,
    userId: number,
  ): Promise<AddressEntity> {
    await this.userService.findUserById(userId);
    await this.cityService.findCityById(createAddress.cityId);

    return await this.addressRepository.save({
      ...createAddress,
      userId,
    });
  }
}
