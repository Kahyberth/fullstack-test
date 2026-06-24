import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConvertCurrencies } from './dto/convertCurrencies.dto';
import {
  ErrorResponse,
  IConvertResponse,
} from 'src/common/types/convert-currencies.type';
import { axiosClient } from 'src/config/app.config';
import { envs } from 'src/common/envs/app.envs';
import axios from 'axios';

@Injectable()
export class ToolsService {
  private logger = new Logger('Tools-Service');

  async convertCurrencies(convertDto: ConvertCurrencies) {
    const { amount, fromCurrency, toCurrency } = convertDto;

    let data: IConvertResponse;
    try {
      const response = await axiosClient.get<IConvertResponse>(
        `/latest.json?app_id=${envs.OPEN_EXCHANGE_APP_ID}&symbols=${fromCurrency},${toCurrency}`,
      );
      data = response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error({
          DATA: error.response?.data as ErrorResponse,
        });
      } else {
        this.logger.error('NON-AXIOS ERROR:', error);
      }
      throw new ServiceUnavailableException(
        'Currency exchange service is unavailable',
      );
    }

    const fromRate = data.rates[fromCurrency];
    const toRate = data.rates[toCurrency];

    if (fromRate === undefined || toRate === undefined) {
      throw new BadRequestException('Invalid currency code provided');
    }

    const rate = toRate / fromRate;
    const convertedAmount = amount * rate;

    return { amount, fromCurrency, toCurrency, rate, convertedAmount };
  }
}
