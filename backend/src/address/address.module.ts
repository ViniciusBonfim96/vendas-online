import { Module } from '@nestjs/common';
import { AddressController } from '@/address/address.controller';
import { AddressService } from '@/address/address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from '@/address/entity/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
