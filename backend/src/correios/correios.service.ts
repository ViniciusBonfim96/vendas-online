import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReturnCepExternal } from './dto/returnCepExternal.dto';
import { CityService } from '@/city/city.service';
import { ReturnCep } from '@/correios/dto/returnCep.dto';

@Injectable()
export class CorreiosService {
  private readonly URL_CORREIOS = process.env.URL_CEP_CORREIOS!;

  constructor(
    private readonly httpService: HttpService,
    private readonly cityService: CityService,
  ) {}

  async findAddressByCep(cep: string): Promise<ReturnCep> {
    const url = this.URL_CORREIOS.replace('{CEP}', cep);

    const { data } = await this.httpService
      .axiosRef!.get<ReturnCepExternal>(url)
      .catch((error: any) => {
        throw new BadRequestException(
          `Error in connection request ${error.message}`,
        );
      });

    if (data?.erro === true || data?.erro === 'true') {
      throw new NotFoundException('CEP not found');
    }

    const city = await this.cityService.findCityByName(
      data.localidade,
      data.uf,
    );

    if (!city) {
      throw new NotFoundException(
        `City not found: ${data.localidade} - ${data.uf}`,
      );
    }
    return new ReturnCep(data, city?.id, city?.state?.id);
  }
}
