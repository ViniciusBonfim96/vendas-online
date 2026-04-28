import { Controller, Get, Param } from '@nestjs/common';
import { CorreiosService } from '@/correios/correios.service';
import { ReturnCep } from './dto/returnCep.dto';

@Controller('correios')
export class CorreiosController {
  constructor(private readonly correiosService: CorreiosService) {}

  @Get('/:cep')
  async findAll(@Param('cep') cep: string): Promise<ReturnCep> {
    return this.correiosService.findAddressByCep(cep);
  }
}
