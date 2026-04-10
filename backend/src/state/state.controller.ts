import { Controller, Get } from '@nestjs/common';
import { StateService } from '@/state/state.service';
import { StateEntity } from '@/state/entity/state.entity';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get()
  async getAllState(): Promise<StateEntity[]> {
    return this.stateService.getAllState();
  }
}
