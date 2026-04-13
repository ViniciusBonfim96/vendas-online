import { Module } from '@nestjs/common';
import { AddressController } from '@/address/address.controller';
import { AddressService } from '@/address/address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from '@/address/entity/address.entity';
import { UserModule } from '@/user/user.module';
import { CityModule } from '@/city/city.module';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity]), UserModule, CityModule],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
