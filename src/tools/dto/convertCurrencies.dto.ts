import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConvertCurrencies {
  @ApiProperty({
    description: 'Amount to convert',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Source currency',
    example: 'USD',
  })
  @IsString()
  @IsNotEmpty()
  fromCurrency: string;
  @ApiProperty({
    description: 'Target currency',
    example: 'EUR',
  })
  @IsString()
  @IsNotEmpty()
  toCurrency: string;
}
