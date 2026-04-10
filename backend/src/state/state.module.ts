import { Module } from '@nestjs/common';
import { StateController } from '@/state/state.controller';
import { StateService } from '@/state/state.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateEntity } from '@/state/entity/state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StateEntity])],
  controllers: [StateController],
  providers: [StateService],
})
export class StateModule {}
