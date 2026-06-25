import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QueryDto {
  @ApiProperty({
    description: 'Query to search for products',
    example: 'phone',
  })
  @IsString()
  @IsNotEmpty()
  query: string;
}
