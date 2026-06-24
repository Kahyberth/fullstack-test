import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ConvertCurrencies {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  fromCurrency: string;

  @IsString()
  @IsNotEmpty()
  toCurrency: string;
}
