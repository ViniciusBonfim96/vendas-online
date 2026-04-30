import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MelhorEnvioService {
  private readonly token = process.env.MELHOR_ENVIO_TOKEN;

  async calculateShipping(cepDestino: string) {
    try {
      const { data } = await axios.post(
        'https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate',
        {
          from: { postal_code: '01310100' },
          to: { postal_code: cepDestino },

          package: {
            height: 30,
            width: 30,
            length: 30,
            weight: 2,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'MinhaApp (seuemail@provedor.com)',
          },
        },
      );

      return data;
    } catch (error: any) {
      console.log('--- ERRO NO SANDBOX ---');
      console.dir(error.response?.data, { depth: null });

      throw new HttpException(
        error.response?.data?.message || 'Erro no cálculo do Sandbox',
        error.response?.status || 400,
      );
    }
  }
}
