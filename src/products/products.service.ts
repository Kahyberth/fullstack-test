import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse/sync';
import {
  DATA_DIR,
  OPENAI_CLIENT,
  OPENAI_EMBEDDING_MODEL,
  PRODUCTS_LIST_FILENAME,
} from 'src/config/app.config';
import {
  EmbeddedProduct,
  Product,
} from 'src/common/types/search-products.type';
import OpenAI from 'openai';

@Injectable()
export class ProductsService {
  private embeddedProducts: EmbeddedProduct[] = [];
  private readonly logger = new Logger('Products-Service');
  constructor(@Inject(OPENAI_CLIENT) private readonly openai: OpenAI) {}

  async onModuleInit() {
    const products = this.loadProducts();
    this.embeddedProducts = await this.buildEmbeddingIndex(products);
    this.logger.log(
      `Embedding index built for ${this.embeddedProducts.length} products`,
    );
  }

  private async buildEmbeddingIndex(
    products: Product[],
  ): Promise<EmbeddedProduct[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: OPENAI_EMBEDDING_MODEL,
        input: products.map((p) => p.embeddingText || p.displayTitle),
      });
      return products.map((product, index) => ({
        product,
        embedding: response.data[index].embedding,
      }));
    } catch (error) {
      this.logger.error('Error building embedding index', error);
      throw new InternalServerErrorException('Error building embedding index');
    }
  }

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
