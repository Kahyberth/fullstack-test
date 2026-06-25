import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse/sync';
import {
  DATA_DIR,
  OPENAI_CLIENT,
  OPENAI_EMBEDDING_MODEL,
  PRODUCTS_LIST_FILENAME,
  PRODUCTS_TO_RETURN,
} from 'src/config/app.config';
import {
  EmbeddedProduct,
  Product,
} from 'src/common/types/search-products.type';
import OpenAI from 'openai';
import { cosineSimilarity } from 'src/common/helper/cosineSimilarity';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class ProductsService implements OnModuleInit {
  private embeddedProducts: EmbeddedProduct[] = [];
  private readonly logger = new Logger('Products-Service');
  constructor(@Inject(OPENAI_CLIENT) private readonly openai: OpenAI) {}

  /**
   * Build the embedding index once when the module starts,
   * so searches don't re embed the catalog on every request
   */

  async onModuleInit() {
    const products = this.loadProducts();
    this.embeddedProducts = await this.buildEmbeddingIndex(products);
    this.logger.log(
      `Embedding index built for ${this.embeddedProducts.length} products`,
    );
  }

  // Embed all products in a single request: results come back in input order
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

  /**
   * Embed the query and rank catalog products by cosine similarity
   * returning the most relevant ones
   */
  async searchProducts({ query }: QueryDto): Promise<Product[]> {
    if (!query) {
      throw new BadRequestException('Query is required');
    }

    try {
      const { data } = await this.openai.embeddings.create({
        model: OPENAI_EMBEDDING_MODEL,
        input: query,
      });
      const queryEmbedding = data[0].embedding;

      return this.embeddedProducts
        .map(({ product, embedding }) => ({
          product,
          score: cosineSimilarity(queryEmbedding, embedding),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, PRODUCTS_TO_RETURN)
        .map((result) => result.product);
    } catch (error) {
      this.logger.error('Error searching products', error);
      throw new InternalServerErrorException('Error searching products');
    }
  }

  loadProducts(): Product[] {
    const filePath = join(process.cwd(), DATA_DIR, PRODUCTS_LIST_FILENAME);
    const fileContent = readFileSync(filePath, 'utf-8');

    /**
     * The source CSV uses unescaped double quotes as inch marks (8", 86")
     * Inside quoted fields, which is invalid csv. We escape only the quotes that
     * are not at a field boundary (not adjacent to a comma or line break) by
     * doubling them ("") so strict parsing still respects commas inside fields
     */

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
