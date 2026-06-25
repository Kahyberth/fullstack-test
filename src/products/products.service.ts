import { Inject, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse/sync';
import {
  DATA_DIR,
  OPENAI_CLIENT,
  PRODUCTS_LIST_FILENAME,
} from 'src/config/app.config';
import { Product } from 'src/common/types/search-products.type';
import OpenAI from 'openai';

@Injectable()
export class ProductsService {
  constructor(@Inject(OPENAI_CLIENT) private readonly openai: OpenAI) {}

  loadProducts(): Product[] {
    const filePath = join(process.cwd(), DATA_DIR, PRODUCTS_LIST_FILENAME);
    const fileContent = readFileSync(filePath, 'utf-8');

    const sanitizedContent = fileContent.replace(
      /(?<=[^,\r\n"])"(?=[^,\r\n"])/g,
      '""',
    );

    const records = parse(sanitizedContent, {
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
    });

    return records.map(
      (row: Record<string, string>): Product => ({
        displayTitle: row.displayTitle,
        embeddingText: row.embeddingText,
        url: row.url,
        imageUrl: row.imageUrl,
        productType: row.productType,
        discount: Number(row.discount || 0),
        price: row.price,
        variants: row.variants,
        createDate: row.createDate,
      }),
    );
  }
}
